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
            name: 'phonebook.model.proxy.importprx',
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
            importContacts: function(data){
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                //Declare local variables
                {path, size, name} = files['import_file'],
                streamreadfile, 
                csvline = '',
                props = ['entry_name', 'entry_firstname', 'entry_address1', 'entry_address2', 
                         'entry_zipcode', 'entry_city', 'entry_phone', 'entry_mobile'],
                log = [`beginning file import ...`],
                //Declare local functions              
                onReadable = () => {
                    let filedata;
                    while (null !== (filedata = streamreadfile.read())) {
                        //Data is delimited by carriage return ...
                        if (filedata.match(/\r/)) {
                            //Extracting end of line and buffering the remainder
                            let s = filedata.split(/\r/), v = s.shift(), b = Buffer.from(s.join('\r'), 'utf8');
                         
                            //Remove stream listeners so as not to emit a parasite readable event during the unshift ...
                            streamreadfile.removeListener('error', onError);
                            streamreadfile.removeListener('readable', onReadable);
                            
                            //Safe unshifting of data into readable
                            if (b.length) {streamreadfile.unshift(b)}
                            
                            //Running promise chain
                            insertContact(csvline += v)
                                .then(nul => confirmInsertion())
                                .catch(raiseError);	

                            //Emptying local buffer 
                            csvline = '';                            
                        } else {
                            //Continue pushing read data into variable ...
                            csvline += filedata;
                        }
                    }
                },
                onError = () => {
                    //Log action
                    log.push(`readable stream emitted an error event while reading the file ...`);
                    //Do nothing more than to log at the moment
                    //readable is not piped and the 'data' and 'readable' events should continue to be emitted anyway
                },
                onEnd = () => {
                   //Running promise chain
                    insertContact(csvline)
                        .then(nul => (() => {
                            logImport(() => {
                                Object.assign(ret, {status: 200, valid: !log.join('').match(/error\s/), msg: log.join('\r\n'), data: null});
                                //Send notification   
                                _this.sendProxyResponse(phonebook.AppConstants.IMPORT_CONTACTS_RET, ret);                                  
                            });
                        })())
                        .catch(err => {
                            logImport(() => {
                                Object.assign(ret, {status: 500, valid: log.join('').match(/error\s/), msg: log.join('\r\n'), data: null});
                                //Send notification   
                                _this.sendProxyResponse(phonebook.AppConstants.IMPORT_CONTACTS_RET, ret);   
                            })
                        });	                    
                },
                logImport = (callback) => {
                        //Creating import log
                        let 
                        {user_firstname, user_lastname} = req.session.user,
                        logdoc = {
                            log_user: `${ user_firstname } ${ user_lastname }`,
                            log_date: new Date().toLocaleString(),
                            log_comments: fields['import_comments'],
                            log_details: log.join('\r\n')
                        };
                        _this.facade.importdata.insertOne(
                            logdoc, 
                            {w : 1},
                            function (err, result) {
                                //Extract mongodb raw results, only on write/delete operations
                                let {ok, n} = result['result'];   
                                if (err || !ok)
                                    console.log(`error saving import log`);
                                callback();                                         
                            });  
                },
                insertContact = data =>
                    new Promise((resolve, reject) => {    
                        //Remove the \n and convert to JSON
                        data = data.replace(/\n/, '').split(';').slice(0, 8);
                        //Declare properties
                        let contactdoc = {};
                        for (let i = 0; i < props.length; i++) 
                            contactdoc[props[i]] = data[i];
                        //Create contact id
                        contactdoc["entry_id"] = _this.createid(contactdoc["entry_firstname"], contactdoc["entry_name"]);
                        //Log action
                        log.push(`creating new contact : ${ contactdoc["entry_name"] } ${ contactdoc["entry_firstname"] },  contact id ${ contactdoc["entry_id"] }`);
                        //Save new contact
                        _this.facade.contactdata.insertOne(
                            contactdoc, 
                            {w : 1},
                            function (err, result) {
                                //Extract mongodb raw results, only on write/delete operations
                                let {ok, n} = result['result'];   
                                if (err || !ok) {
                                    //Log action
                                    log.push(`error occured while inserting contact data into db for id ${ contactdoc["entry_id"] }`);
                                    reject();
                                } else {
                                    //Log action
                                    log.push(`successfully inserted new contact data for id ${ contactdoc["entry_id"] }`);
                                    resolve();
                                }
                            }); 
                    }), 
                confirmInsertion = () =>{
                    //Unshift and insertion are done, start listening to events again ...
                    streamreadfile
                        .on('error', onError)
                        .on('readable', onReadable);
                    //Contradicted by official NodeJS stream API, eventually at this stage emission of readable events stops ...
                    streamreadfile.read(0);
                },
                raiseError = err =>{
                    //Insertion failed, continue reading the file nonetheless ...
                    streamreadfile
                        .on('error', onError)
                        .on('readable', onReadable);
                    //Contradicted by official NodeJS stream API, eventually at this stage emission of readable events stops ...
                    streamreadfile.read(0);
                };                
                
                //Create readable to import file path
                streamreadfile = filesys.createReadStream(path);
                //Set encoding for readable data
                streamreadfile.setEncoding('utf8');
                //Add listeners for readable, error and end events
                streamreadfile
                    .on('readable', onReadable)
                    .on('error', onError)
                    .on('end', onEnd);
            },
            //---------------------------------------------------------------------------------
            getImportLogsList: function(data)  {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res},
                result = [],
                //Return all import logs
                stream = this.facade.importdata.find({}).transformStream();
                stream.on('data', doc => result.push(doc));
                stream.on('end', () => { 
                    Object.assign(ret, {status: 200, valid: true, msg: 'successfully retrieved import logs list...', data: result});
                    //Send notification       
                    _this.sendProxyResponse(phonebook.AppConstants.IMPORT_LOG_LIST_RET, ret); 
                });
            }
            //---------------------------------------------------------------------------------
        },
        // CLASS MEMBERS    
        {
            NAME: 'importprx'
        }
    )
};