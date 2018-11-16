'use strict'

module.exports = function(include, puremvc) {

    // use include te aquire dependency class files
    include("view/component/importcmp");

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.mediator.importmdt',
            parent: puremvc.Mediator
        },
        
        // INSTANCE MEMBERS
        {
            onRegister: function() {

                // Initialize the contacts view component
                this.setViewComponent(new phonebook.view.component.importcmp);
                
                //Callback function reference
                let _this = this;

                //Reference express app through application facade  
                //---------------------------------------------------------------------------------
                //List all import logs (HTTP GET /list)
                this.facade.app.get('/import/list', function (req, res) {   
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.GET_IMPORT_LOGS_LIST, data);    
                });
                //---------------------------------------------------------------------------------
                //Open import form (HTTP GET /form)
                this.facade.app.get('/import/form', function (req, res) {   
                    //Render dynamic form, load HTTP POST form action
                    res.status(200).send(_this.viewComponent.renderImportForm(req.session.user));       
                });
                //--------------------------------------------------------------------------------- 
                //Launch contacts import (HTTP POST /launch)
                this.facade.app.post('/import/launch', function (req, res) {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.IMPORT_CONTACTS, data);
                });
                //--------------------------------------------------------------------------------- 
            }, 

            listNotificationInterests: function() {
                return [phonebook.AppConstants.IMPORT_CONTACTS_RET,
                        phonebook.AppConstants.IMPORT_LOG_LIST_RET]
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
                        case phonebook.AppConstants.IMPORT_CONTACTS_RET :
                            res.status(status).redirect('/contacts/list');
                            break;
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.IMPORT_LOG_LIST_RET :
                            res.status(status).send(this.viewComponent.renderImportLogsList(data, req.session.user));
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
            NAME: 'importmdt'
        }
    );

}