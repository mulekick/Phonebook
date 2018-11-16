'use strict'

module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("model/proxy/contactprx");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command.managecontactscmd',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {
                
                // Get the command name, the data to be processed from the notification, and the proxy
                let 
                cmdname = note.getName(), 
                data = note.getBody(), 
                proxy = this.facade.retrieveProxy(phonebook.model.proxy.contactprx.NAME);

                // Launch function   
                switch (cmdname) {
                    case phonebook.AppConstants.GET_CONTACTS_LIST :
                        proxy.getContactList(data);  
                    break;
                    case phonebook.AppConstants.SAVE_CONTACT :
                        proxy.saveContact(data);
                    break;
                    case phonebook.AppConstants.EDIT_CONTACT :
                        proxy.editContact(data);
                    break;
                    case phonebook.AppConstants.DELETE_CONTACT :
                        proxy.deleteContact(data);
                    break;
                    default :
                        //Do nothing
                    break;
                }                       
            }           
        }
    )
};