'use strict'
const 
contenttype = require('mime-types').contentType;    //module for mime types retrieval

module.exports = function(include, puremvc) {

    // use include te aquire dependency class files
    include("view/component/callcmp");

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.mediator.callmdt',
            parent: puremvc.Mediator
        },
        
        // INSTANCE MEMBERS
        {
            onRegister: function() {

                // Initialize the contacts view component
                this.setViewComponent(new phonebook.view.component.callcmp);
                
                //Callback function reference
                let _this = this;

                //Reference express app through application facade                  
                //--------------------------------------------------------------------------------- 
                //List all calls for given contact id (HTTP GET /list/id)
                this.facade.app.get('/calls/list/:id', (req, res) => {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.GET_CALLS_FOR_ID, data);
                });
                //--------------------------------------------------------------------------------- 
                //New call entry (HTTP GET /new/id)
                this.facade.app.get('/calls/new/:id', (req, res) => {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.NEW_CALL_FOR_ID, data);
                });
                //---------------------------------------------------------------------------------
                //Save call (HTTP POST /save)
                this.facade.app.post('/calls/save', (req, res) => {  
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.SAVE_CALL_FOR_ID, data);
                });
                //--------------------------------------------------------------------------------- 
                //Retrieve call file (HTTP GET /file/id/timestamp)
                this.facade.app.get('/calls/file/:id/:ts', (req, res) => {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.GET_CALL_FILE, data);
                });
                //--------------------------------------------------------------------------------- 
                //Delete call (HTTP GET /calls/delete/id/timestamp)
                this.facade.app.get('/calls/delete/:id/:ts', (req, res) => {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.DELETE_CALL, data);
                });
                //--------------------------------------------------------------------------------- 
            },  

            listNotificationInterests: function() {
                return [phonebook.AppConstants.CALLS_FOR_ID_RET,
                        phonebook.AppConstants.CALL_FOR_ID_SAVED,
                        phonebook.AppConstants.CALL_FILE_RET,
                        phonebook.AppConstants.NEW_CALL_FOR_ID_RET,
                        phonebook.AppConstants.CALL_DELETED]
            },

            handleNotification: function(note) {
                //Extract properties via object destructuring
                let {req, res, status, valid, msg, data} = note.getBody();
                //Process proxy response                
                console.log(msg); 
                if (!valid) {
                    res.status(status).send('<p>' + msg + '</p>');
                } else {
                    switch(note.getName()) {
                    //-----------------------------------------------------------------------------
                    case phonebook.AppConstants.CALLS_FOR_ID_RET :
                        res.status(status).send(this.viewComponent.renderCallsList(data, req.session.user));
                        break;
                    //-----------------------------------------------------------------------------
                    case phonebook.AppConstants.CALL_FOR_ID_SAVED :
                        res.status(status).redirect('/contacts/list');
                        break;
                    //-----------------------------------------------------------------------------
                    case phonebook.AppConstants.NEW_CALL_FOR_ID_RET :
                        res.status(status).send(this.viewComponent.renderCallForm('new', null, data['entry_id'], req.session.user));
                        break;
                    //-----------------------------------------------------------------------------
                    case phonebook.AppConstants.CALL_FILE_RET :
                        res.writeHead(status, {
                            'Content-Type': contenttype(data['filename']),          
                            'Content-disposition': 'inline',
                            'Content-Length': data['length']
                        });
                        data['stream'].pipe(res);
                        data['stream']
                            .on('file',function() {
                                console.log("opening requested file");
                            })
                            .on('close', function() {
                                console.log("closing requested file");
                            })
                            .on('error', function() {
                                console.log('error reading file from database, aborting file request');
                                res.end();
                            });
                        res
                            .on('finish', function () {
                                console.log('HTTP response completed, requested file sent');
                            })
                            .on('close', function () {
                                console.log('HTTP connection terminated, aborting file request and destroying readable');
                                data['stream'].destroy();
                            });
                        break;
                    //-----------------------------------------------------------------------------
                    case phonebook.AppConstants.CALL_DELETED :
                        res.status(status).redirect(`/calls/list/${ data['entry_id'] }`);
                        break;
                    //-----------------------------------------------------------------------------
                    default:
                        break;
                    //----------------------------------------------------------------------------- 
                    }
                }
            },          
            
            onRemove: function() {}
        },
        
        // STATIC MEMBERS
        {
            NAME: 'callmdt'
        }
    );

}