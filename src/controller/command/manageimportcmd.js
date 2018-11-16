'use strict'

module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("model/proxy/importprx");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command.manageimportcmd',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {
                
                // Get the command name, the data to be processed from the notification, and the proxy
                let 
                cmdname = note.getName(), 
                data = note.getBody(), 
                proxy = this.facade.retrieveProxy(phonebook.model.proxy.importprx.NAME);

                // Launch function   
                switch (cmdname) {
                    case phonebook.AppConstants.IMPORT_CONTACTS :
                        proxy.importContacts(data);  
                    break;
                    case phonebook.AppConstants.GET_IMPORT_LOGS_LIST :
                        proxy.getImportLogsList(data);  
                    break;
                    default :
                        //Do nothing
                    break;
                }                       
            }           
        }
    )
};