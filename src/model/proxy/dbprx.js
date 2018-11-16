'use strict'
//Load modules
const
mngdbc = require('mongodb').MongoClient,    //MongoDB driver v.3.2
mngbck = require('mongodb').GridFSBucket;   //MongoDB GridFS bucket for large files storage

let _this;

module.exports = function(include,puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.model.proxy.dbprx',
            parent: puremvc.Proxy
        },
        // INSTANCE MEMBERS
        {
            //---------------------------------------------------------------------------------
            //Send notifications
            sendProxyResponse: function(notificationid, ret) {
                //Mandatory for enforcing strict mode with object destructuring
                let valid, msg, data;
                //Extract properties via object destructuring
                this.sendNotification(notificationid, {valid, msg, data} = ret);
            },
            //---------------------------------------------------------------------------------
            onRegister: function() {
                
                //Callback function reference
                _this = this;

            },
            //---------------------------------------------------------------------------------
            connectToDatabase: function() {
                let 
                ret = {},
                database = null,
                bucketname = 'calldocuments',               //GridFS bucket name
                collfilesname = 'calldocuments.files';      //GridFS files collection name
                //Connect to the MongoDB database
                mngdbc.connect(phonebook.AppConstants.DB_SRV_URL, {useNewUrlParser: true}, (err, client) => {
                    //Init all collections values to null
                    let  [userdata, importdata, contactdata, calldata, bucket, collfiles] = [null, null, null, null, null, null];
                    if (err) {
                        //Store return values
                        Object.assign(ret, {valid: false, msg: `error connecting to the MongoDB server : ${ err }`, data: {userdata, importdata, contactdata, calldata, bucket, collfiles}});
                        //Send notification (FAILURE)
                        _this.sendProxyResponse(phonebook.AppConstants.DB_CONNECTED, ret);
                        return;
                    };
                    //Retrieve authentification db
                    if (database = client.db(phonebook.AppConstants.DB_NAME_AUTH)) {
                        console.log(`connected to authentification db`);
                        userdata = database.collection('users');
                        //Session data is managed automatically by MongoStore
                    };
                    //Retrieve imports db
                    if (database = client.db(phonebook.AppConstants.DB_NAME_IMPORTS)) {
                        console.log(`connected to imports db`);
                        importdata = database.collection('import.logs');
                    };
                    //Retrieve contacts db
                    if (database = client.db(phonebook.AppConstants.DB_NAME_CONTACTS)) {
                        console.log(`connected to contacts db`);
                        contactdata = database.collection('contacts');
                    };
                    //Retrieve calls db
                    if (database = client.db(phonebook.AppConstants.DB_NAME_CALLS)) {
                        console.log(`connected to calls db`);
                        calldata = database.collection('calls'),
                        bucket = new mngbck(database, {
                            chunkSizeBytes: 10 * 1024, //10 MB
                            bucketName: bucketname
                        }),
                        collfiles = database.collection(collfilesname);
                    };

                    //Store return values
                    Object.assign(ret, {valid: true, msg: `connected successfully to the MongoDB server`, data: {userdata, importdata, contactdata, calldata, bucket, collfiles}});
                    //Send notification (SUCCESS)
                    _this.sendProxyResponse(phonebook.AppConstants.DB_CONNECTED, ret);  
                });
            }
        },
        // CLASS MEMBERS    
        {
            NAME: 'dbprx'
        }
    )
};