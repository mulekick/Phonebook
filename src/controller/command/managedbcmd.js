'use strict'

module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("model/proxy/dbprx");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command.managedbcmd',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {
                
                // Get the command name, the data to be processed from the notification, and the proxy
                let 
                cmdname = note.getName(), 
                data = note.getBody(), 
                proxy = this.facade.retrieveProxy(phonebook.model.proxy.dbprx.NAME);

                // Launch function   
                switch (cmdname) {
                    case phonebook.AppConstants.DB_CONNECT :
                        proxy.connectToDatabase();  
                    break;
                    default :
                        //Do nothing
                    break;
                }                      
            }           
        }
    )
};