'use strict'

module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("model/proxy/authenticationprx");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command.manageauthenticationcmd',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {
                
                // Get the command name, the data to be processed from the notification, and the proxy
                let 
                cmdname = note.getName(), 
                data = note.getBody(), 
                proxy = this.facade.retrieveProxy(phonebook.model.proxy.authenticationprx.NAME);

                // Launch function   
                switch (cmdname) {
                    case phonebook.AppConstants.REGISTER_USER :
                        proxy.registerUser(data);  
                    break;
                    case phonebook.AppConstants.LOGIN_USER :
                        proxy.loginUser(data);  
                    break;
                    default :
                        //Do nothing
                    break;
                }                       
            }           
        }
    )
};