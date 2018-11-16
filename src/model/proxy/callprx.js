'use strict'
//Load modules
const
filesys = require('fs');    //file system module

//Write concern will be used for insert/update operations

let _this;

module.exports = function(include,puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.model.proxy.callprx',
            parent: puremvc.Proxy
        },
        // INSTANCE MEMBERS
        {
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
            getCallsListForId: function(data)   {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Extract contact id from request params
                id = "id" in params ? params["id"] : "";
                console.log(`searching calls list for contact id : ${ id }`); 
                //Return calls for given contact id
                let 
                result = [],
                stream = this.facade.calldata.find({'call_id': id}).transformStream();
                stream.on('data', doc => result.push(doc));
                stream.on('end', () => {
                    Object.assign(ret, {status: 200, valid: true, msg: 'successfully retrieved calls list...', data: result});
                    //Send notification  
                    _this.sendProxyResponse(phonebook.AppConstants.CALLS_FOR_ID_RET, ret);
                });     
            },
            //---------------------------------------------------------------------------------
            createCallForId: function(data) {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Extract contact id from request params
                id = "id" in params ? params["id"] : ""; 
                //Check contact id              
                this.facade.contactdata.findOne({'entry_id': id}, function (err, result) {
                    //Handle this as a HTTP 500
                    if (err) {
                        Object.assign(ret, {status: 500, valid: false, msg: 'error creating new call : failed to load contact data from database', data: null});
                        //Handle this as a HTTP 404
                    } else if (result === null) {
                        Object.assign(ret, {status: 404, valid: false, msg: 'error creating new call : contact data not found in database', data: null});
                    //Render dynamic form, load HTTP POST form action
                    } else {
                        Object.assign(ret, {status: 200, valid: true, msg: `creating new call for id : ${ id }`, data: result});
                    }   
                    //Send notification         
                    _this.sendProxyResponse(phonebook.AppConstants.NEW_CALL_FOR_ID_RET, ret);
                });
            },
            //---------------------------------------------------------------------------------
            saveCallForId: function(data) {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Define local asynchronous functions
                extractuserid = () => 
                    new Promise((resolve, reject) => {
                        //Extract contact id from request body  
                        if ("call_id" in fields === false) {
                            Object.assign(ret, {status: 404, valid: false, msg: 'error saving new call : no contact ID was provided', data: null});
                            reject();
                        } else {
                            let id = fields['call_id'];
                            resolve(id);
                        } 
                    }),
                checkuserid = id =>
                    new Promise((resolve, reject) => {
                        //Check contact id              
                        _this.facade.contactdata.findOne({'entry_id': id}, function (err, result) {
                            //Handle this as a HTTP 500
                            if (err) {
                                Object.assign(ret, {status: 500, valid: false, msg: `error saving new call for id : ${ id }`, data: null});
                                reject();
                            //Handle this as a HTTP 404
                            } else if (result === null) {
                                Object.assign(ret, {status: 404, valid: false, msg: 'error saving new call : contact data not found in database', data: null});
                                reject();
                            } else{
                                resolve(id);                                    
                            }
                        });
                    }),
                writefiletodb = id => 
                    new Promise((resolve, reject) => {
                        //Local variables
                        let ts = fields['call_timestamp'] = Date.now(),
                        //Extract properties via object destructuring
                        {path, size, name} = files['call_file'],
                        streamreadfile, streamwritedb;
                        if (size > 0 && name !== "") {
                            fields["call_file"] = {file_name : name};
                            streamreadfile = filesys.createReadStream(path);
                            streamwritedb = _this.facade.bucket.openUploadStream(name, {
                                metadata: {
                                    id: id,
                                    ts: ts 
                                }
                            });
                            streamreadfile
                                .pipe(streamwritedb)
                                .on('error', err => {
                                    Object.assign(ret, {status: 500, valid: false, msg: `error saving file attached to new call for contact id : ${ id }`, data: null});                                        
                                    reject();
                                })
                                .on('finish', () => { 
                                    resolve(id);
                                });
                        } else {
                            fields["call_file"] = null;   
                            resolve(id);                             
                        } 
                    }),
                insertcallindb = id => {
                        _this.facade.calldata.insertOne(fields, {w : 1}, function (err, result)  {
                            //Extract mongodb raw results, only on write/delete operations
                            let {ok, n} = result['result']; 
                            //Handle this as a HTTP 500
                            if (err || !ok) {
                                Object.assign(ret, {status: 500, valid: false, msg: `error saving new call for id : ${ id }`, data: null});
                            //Render dynamic form, load HTTP POST form action
                            } else {
                                Object.assign(ret, {status: 200, valid: true, msg: `successfully saved new call for contact id : ${ id }`, data: result});
                            }
                            //Send notification (FAILURE / SUCCESS)  
                            _this.sendProxyResponse(phonebook.AppConstants.CALL_FOR_ID_SAVED, ret);
                        });
                    },
                raiseerror = err => 
                    //Send notification (FAILURE) 
                    _this.sendProxyResponse(phonebook.AppConstants.CALL_FOR_ID_SAVED, ret);
                
                //Running promise chain
                extractuserid()
                    .then(id => checkuserid(id))
                    .then(id => writefiletodb(id))
                    .then(id => insertcallindb(id))
                    .catch(raiseerror);	
            },
            //---------------------------------------------------------------------------------
            getCallFile: function(data) {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Extract contact id and timestamp from request params (Express.js specific, different from Node.js)
                id = "id" in params ? params["id"] : "",
                ts = "ts" in params ? params["ts"] : "";  
                if (id === "" || ts === "") {
                    Object.assign(ret, {status: 404, valid: false, msg: 'error retrieving file : contact id and/or timestamp missing', data: null});
                    //Send notification (FAILURE)  
                    _this.sendProxyResponse(phonebook.AppConstants.CALL_FILE_RET, ret);                  
                    return;
                };
                //Retrieve file
                this.facade.collfiles.findOne({
                    metadata: {
                        'id': id,
                        'ts': (1 * ts) 
                    }
                }, function (err, result) {
                    //Handle this as a HTTP 404
                    if (err || result === null) {
                        Object.assign(ret, {status: 404, valid: false, msg: 'no document found', data: null});  
                    //Retrieve GridFS readable stream to mediator...
                    } else {      
                        //Extract properties via object destructuring               
                        let {filename, length, _id} = result, streamreaddb = _this.facade.bucket.openDownloadStream(_id);
                        Object.assign(ret, {status: 200, valid: true, msg: 'retrieving document...', data: {
                            stream: streamreaddb,
                            length: length,
                            filename: filename
                        }});
                    }
                    //Send notification     
                    _this.sendProxyResponse(phonebook.AppConstants.CALL_FILE_RET, ret);      
                })
            },
            //---------------------------------------------------------------------------------
            deleteCall: function(data) {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Extract contact id and timestamp from request params (Express.js specific, different from Node.js)
                id = "id" in params ? params["id"] : "",
                ts = "ts" in params ? params["ts"] : "",
                //Define local asynchronous functions
                findFileDoc = () => 
                    new Promise((resolve, reject) => {
                        //Find file document in GridFS bucket
                        _this.facade.collfiles.findOne({
                            metadata: {
                                'id': id,
                                'ts': (1 * ts) 
                            }
                        }, function (err, result) {
                            //Reject if error occurs
                            if (err) {
                                Object.assign(ret, {status: 500, valid: false, msg: `call deletion error : unable to retrieve call attached file for contact id : ${ id }`, data: {'entry_id': id}});
                                reject(); 
                            //Resolve with files collection document _id (may be null ...)
                            } else {                   
                                resolve(result['_id']);
                            }     
                        })
                    }),
                removeFile = fileDocId => 
                    new Promise((resolve, reject) => {
                        //Resolve if no file
                        if (!fileDocId)
                            resolve();
                        //Remove file from GridFS if present
                        _this.facade.bucket.delete(fileDocId, function (err) {
                            if (err) {
                                Object.assign(ret, {status: 500, valid: false, msg: `error deleting call attached file for contact id : ${ id }`, data: {'entry_id': id}});
                                reject();
                            } else {
                                resolve();
                            }
                        })
                    }),
                removeCall = () =>
                    new Promise((resolve, reject) => {
                        //Remove call
                        _this.facade.calldata.deleteOne(
                            {'call_id': id, 'call_timestamp': (1 * ts)}, 
                            {w: 1},
                            function (err, result) {
                                //Extract mongodb raw results, only on write/delete operations
                                let {ok, n} = result['result']; 
                                //Handle this as a HTTP 500
                                if (err || !ok) {
                                    Object.assign(ret, {status: 500, valid: false, msg: `error deleting call for contact id : ${ id }`, data: {'entry_id': id}});
                                    reject();
                                //Handle this as a HTTP 404
                                } else if (n === 0) {
                                    Object.assign(ret, {status: 404, valid: false, msg: `error deleting call for contact id : ${ id } : call data not found in database`, data: {'entry_id': id}});
                                    reject();
                                } else {
                                    Object.assign(ret, {status: 200, valid: true, msg: `successfully deleted call for contact id : ${ id }`, data: {'entry_id': id}});
                                    resolve(); 
                                } 
                            });
                    }),
                confirmDeletion = () =>
                    //Send notification (SUCCESS)
                    _this.sendProxyResponse(phonebook.AppConstants.CALL_DELETED, ret),
                raiseError = err => 
                    //Send notification (FAILURE) 
                    _this.sendProxyResponse(phonebook.AppConstants.CALL_DELETED, ret);

                if (id === "" || ts === "") {
                    Object.assign(ret, {status: 404, valid: false, msg: 'error deleting call : contact id and/or timestamp missing', data: {'entry_id': id}});
                    //Send notification (FAILURE)  
                    _this.sendProxyResponse(phonebook.AppConstants.CALL_DELETED, ret);                  
                    return;
                };

                console.log(`call deletion request for id: ${ id } and timestamp ${ ts }`);
                //Running promise chain
                findFileDoc()
                    .then(fileDocId => removeFile(fileDocId))
                    .then(nul => removeCall())
                    .then(nul => confirmDeletion())
                    .catch(raiseError);
            }
            //---------------------------------------------------------------------------------
        },
        // CLASS MEMBERS    
        {
            NAME: 'callprx'
        }
    )
};