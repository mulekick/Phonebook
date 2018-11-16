'use strict'

module.exports = function(include, puremvc) {

    // use include te aquire dependency class files
    include("view/component/contactcmp");

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.mediator.contactmdt',
            parent: puremvc.Mediator
        },
        
        // INSTANCE MEMBERS
        {
            onRegister: function() {

                // Initialize the contacts view component
                this.setViewComponent(new phonebook.view.component.contactcmp);
                
                //Callback function reference
                let _this = this;

                //Reference express app through application facade  
                //--------------------------------------------------------------------------------- 
                //List all contact entries (HTTP GET /list)
                this.facade.app.get('/contacts/list', function (req, res) {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.GET_CONTACTS_LIST, data);
                });
                //---------------------------------------------------------------------------------
                //Save contact entry (HTTP POST /save)
                this.facade.app.post('/contacts/save', function (req, res) {
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.SAVE_CONTACT, data)
                });
                //---------------------------------------------------------------------------------
                //Edit contact entry (HTTP GET /edit/id)
                this.facade.app.get('/contacts/edit/:id', function (req, res) {                    
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.EDIT_CONTACT, data);
                });
                //---------------------------------------------------------------------------------
                //New contact entry (HTTP GET /new)
                this.facade.app.get('/contacts/new', function (req, res) {
                    //Render dynamic form, load HTTP POST form action
                    return res.status(200).send(_this.viewComponent.renderContactForm('new', null, null, req.session.user));
                });
                //---------------------------------------------------------------------------------
                //Delete contact entry (HTTP GET /delete/id)
                this.facade.app.get('/contacts/delete/:id', function (req, res) {                    
                    //Passing request and result to proxy to preserve object reference in notification handling
                    let data = {req: req, res: res};
                    //Notify > command > proxy
                    _this.sendNotification(phonebook.AppConstants.DELETE_CONTACT, data);
                });
                //---------------------------------------------------------------------------------     
            },  

            listNotificationInterests: function() {
                return [phonebook.AppConstants.CONTACTS_LIST_RET,
                        phonebook.AppConstants.CONTACT_SAVED,
                        phonebook.AppConstants.CONTACT_EDITED,
                        phonebook.AppConstants.CONTACT_DELETED]
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
                        case phonebook.AppConstants.CONTACTS_LIST_RET :
                            res.status(status).send(this.viewComponent.renderContactsList(data, req.session.user));
                            break;
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.CONTACT_SAVED :
                            res.status(status).redirect('/contacts/list');
                            break;
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.CONTACT_EDITED :
                            res.status(status).send(this.viewComponent.renderContactForm('edit', data, data['entry_id'], req.session.user));
                            break;
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.CONTACT_DELETED :
                            res.status(status).redirect('/contacts/list');
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
            NAME: 'contactmdt'
        }
    );

}