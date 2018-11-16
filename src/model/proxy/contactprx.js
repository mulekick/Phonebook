'use strict'

//Write concern will be used for insert/update operations

let _this;

module.exports = function(include,puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.model.proxy.contactprx',
            parent: puremvc.Proxy
        },
        // INSTANCE MEMBERS
        {
            //---------------------------------------------------------------------------------
            //Create a new id if necessary
            createid: function(f, l) {
                let n, p, id = (n = f + l)
                    .toLowerCase().repeat(2)
                    .slice((p = Math.floor(Math.random() * 100) % n.length), p + n.length);
                return [...id].map(x => x.charCodeAt()).join("").slice(0, 12);
            },
            //---------------------------------------------------------------------------------
            //Send notifications
            sendProxyResponse: function(notificationid, ret) {
                //Mandatory for enforcing strict mode with object destructuring
                let req, res, status, valid, msg, data;
                //Extract properties via object destructuring
                this.sendNotification(notificationid, {req, res, status, valid, msg, data} = ret);
            },
            //---------------------------------------------------------------------------------
            onRegister: function() {
                
                //Callback function reference
                _this = this;
            },
            //---------------------------------------------------------------------------------            
            editContact: function(data) {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Extract contact id from request params
                id = "id" in params ? params["id"] : "";  
                console.log(`Searching directory for contact id: ${ id }`);
                //Return contact data, given contact id             
                this.facade.contactdata.findOne({'entry_id': id}, function (err, result) {
                    //Handle this as a HTTP 500
                    if (err) {
                        Object.assign(ret, {status: 500, valid: false, msg: 'error loading contact data from database', data: null});
                    //Handle this as a HTTP 404
                    } else if (result === null) {
                        Object.assign(ret, {status: 404, valid: false, msg: 'contact data not found in database', data: null});
                    //Render dynamic form, load HTTP POST form action
                    } else {
                        Object.assign(ret, {status: 200, valid: true, msg: `successfully edited contact data for contact id : ${ id }`, data: result});
                    }
                    //Send notification   
                    _this.sendProxyResponse(phonebook.AppConstants.CONTACT_EDITED, ret);         
                });
            },
            //---------------------------------------------------------------------------------
            saveContact: function(data) {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Update /create contact entry
                id = "entry_id" in fields ? 
                    (console.log("contact update request"), fields["entry_id"]) : 
                    (console.log("new contact creation request"), fields["entry_id"] = _this.createid(fields["entry_firstname"], fields["entry_name"]));              
                //Save contact, given contact id
                this.facade.contactdata.updateOne(
                    {'entry_id': id}, 
                    {$set: fields}, 
                    {upsert : true, w : 1},
                    function (err, result) {
                        //Extract mongodb raw results, only on write/delete operations
                        let {ok, n} = result['result'];    
                        if (err || !ok) {
                            Object.assign(ret, {status: 500, valid: false, msg: `error saving contact data for id : ${ id }`, data: null});
                        } else {
                            Object.assign(ret, {status: 200, valid: true, msg: `successfully saved contact data for id : ${ id }`, data: result});
                        }
                        //Send notification 
                        _this.sendProxyResponse(phonebook.AppConstants.CONTACT_SAVED, ret);    
                    });           
            },
            //---------------------------------------------------------------------------------
            getContactList: function(data)  {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                result = [],
                //Return all contacts
                stream = this.facade.contactdata.find({}).transformStream();
                stream.on('data', doc => result.push(doc));
                stream.on('end', () => { 
                    Object.assign(ret, {status: 200, valid: true, msg: 'successfully retrieved contacts list...', data: result});
                    //Send notification       
                    _this.sendProxyResponse(phonebook.AppConstants.CONTACTS_LIST_RET, ret); 
                });
            },
            //---------------------------------------------------------------------------------
            deleteContact: function(data)  {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Extract contact id from request params
                id = "id" in params ? params["id"] : "", 
                //Define local asynchronous functions
                deletecallsfiles = id =>
                    new Promise((resolve, reject) => {
                        //Delete calls files
                        let _idfiles = [], stream = _this.facade.collfiles.find({"metadata.id": id}).transformStream();
                        //Retrieving _id of the files docs to remove ...
                        stream.on('data', doc => _idfiles.push(doc['_id']));
                        stream.on('end', () => {
                            //Deleting files from GridFS bucket
                            _idfiles.forEach(idfile =>
                                _this.facade.bucket.delete(idfile, function (err) {
                                    if (err) {
                                        Object.assign(ret, {status: 500, valid: false, msg: `error deleting call attached file for contact id : ${ id } and file id ${ idfile }`, data: {'entry_id': id}});
                                        reject();
                                    }
                                }));
                            //All files were cleanly removed, so resolve
                            console.log(`successfully removed ${ _idfiles.length } attached files`);
                            resolve(id); 
                        });
                    }),
                deletecallsdocs = id => 
                    new Promise((resolve, reject) => {
                        //Delete calls
                        _this.facade.calldata.deleteMany(
                            {'call_id': id}, 
                            {w: 1},
                            function (err, result) {
                                //Extract mongodb raw results, only on write/delete operations
                                let {ok, n} = result['result'];                                
                                //Handle this as a HTTP 500
                                if (err || !ok) {
                                    Object.assign(ret, {status: 500, valid: false, msg: `error deleting calls for contact id : ${ id }`, data: null});
                                    reject();
                                } else {
                                    console.log(`successfully deleted ${ n } calls for contact id : ${ id }`);
                                    resolve(id); 
                                }  
                            });                    
                    }),
                deletecontactdoc = id => 
                    new Promise((resolve, reject) => {
                        //Delete contact
                        _this.facade.contactdata.deleteOne(
                            {'entry_id': id}, 
                            {w: 1},
                            function (err, result) {
                                //Extract mongodb raw results, only on write/delete operations
                                let {ok, n} = result['result']; 
                                //Handle this as a HTTP 500
                                if (err || !ok) {
                                    Object.assign(ret, {status: 500, valid: false, msg: `error deleting contact for id : ${ id }`, data: null});
                                    reject();
                                //Handle this as a HTTP 404
                                } else if (n === 0) {
                                    Object.assign(ret, {status: 404, valid: false, msg: `error deleting contact for id : ${ id } : contact data not found in database`, data: null});
                                    reject();
                                } else {
                                    Object.assign(ret, {status: 200, valid: true, msg: `successfully deleted contact id : ${ id }`, data: null});
                                    resolve(); 
                                } 
                            });                    
                    }),
                confirmdeletion = () =>
                    //Send notification (SUCCESS)
                    _this.sendProxyResponse(phonebook.AppConstants.CONTACT_DELETED, ret),
                raiseerror = err => 
                    //Send notification (FAILURE) 
                    _this.sendProxyResponse(phonebook.AppConstants.CONTACT_DELETED, ret);

                console.log(`contact deletion request for id: ${ id }`);
                //Running promise chain
                deletecallsfiles(id)
                    .then(id => deletecallsdocs(id))
                    .then(id => deletecontactdoc(id))
                    .then(nul => confirmdeletion())
                    .catch(raiseerror);
            }
            //---------------------------------------------------------------------------------
        },
        // CLASS MEMBERS    
        {
            NAME: 'contactprx'
        }
    )
};