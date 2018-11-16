'use strict'
module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("model/proxy/callprx");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command.managecallscmd',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {
                
                // Get the command name, the data to be processed from the notification, and the proxy
                let 
                cmdname = note.getName(), 
                data = note.getBody(), 
                proxy = this.facade.retrieveProxy(phonebook.model.proxy.callprx.NAME);

                // Launch function   
                switch (cmdname) {
                    case phonebook.AppConstants.GET_CALLS_FOR_ID :
                        proxy.getCallsListForId(data);
                    break;
                    case phonebook.AppConstants.NEW_CALL_FOR_ID :
                        proxy.createCallForId(data);
                    break;
                    case phonebook.AppConstants.SAVE_CALL_FOR_ID :
                        proxy.saveCallForId(data);
                    break;
                    case phonebook.AppConstants.GET_CALL_FILE :
                        proxy.getCallFile(data);
                    break;
                    case phonebook.AppConstants.DELETE_CALL :
                        proxy.deleteCall(data);
                    break;
                    default :
                        //Do nothing
                    break;
                }                       
            }           
        }
    )
};