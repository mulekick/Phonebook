'use strict'
module.exports = function(include,puremvc) {

    // use include te aquire dependency class files 
    include("controller/command/managedbcmd");
    include("controller/command/manageauthenticationcmd");
    include("controller/command/manageimportcmd");
    include("controller/command/managecontactscmd");
    include("controller/command/managecallscmd");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command._controllercommand',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {

                // register command managedbcmd to handle the DB_CONNECT notification 
                this.facade.registerCommand(phonebook.AppConstants.DB_CONNECT, phonebook.controller.command.managedbcmd);

                // register command manageauthenticationcmd to handle the REGISTER_USER notification 
                this.facade.registerCommand(phonebook.AppConstants.REGISTER_USER, phonebook.controller.command.manageauthenticationcmd);

                // register command manageauthenticationcmd to handle the LOGIN_USER notification 
                this.facade.registerCommand(phonebook.AppConstants.LOGIN_USER, phonebook.controller.command.manageauthenticationcmd);

                // register command manageimportcmd to handle the IMPORT_CONTACTS notification 
                this.facade.registerCommand(phonebook.AppConstants.IMPORT_CONTACTS, phonebook.controller.command.manageimportcmd);

                // register command manageimportcmd to handle the GET_IMPORT_LOGS_LIST notification 
                this.facade.registerCommand(phonebook.AppConstants.GET_IMPORT_LOGS_LIST, phonebook.controller.command.manageimportcmd);

                // register command managecontactscmd to handle the GET_CONTACTS_LIST notification 
                this.facade.registerCommand(phonebook.AppConstants.GET_CONTACTS_LIST, phonebook.controller.command.managecontactscmd);

                // register command managecontactscmd to handle the SAVE_CONTACT notification 
                this.facade.registerCommand(phonebook.AppConstants.SAVE_CONTACT, phonebook.controller.command.managecontactscmd);

                // register command managecontactscmd to handle the EDIT_CONTACT notification 
                this.facade.registerCommand(phonebook.AppConstants.EDIT_CONTACT, phonebook.controller.command.managecontactscmd);

                // register command managecontactscmd to handle the DELETE_CONTACT notification 
                this.facade.registerCommand(phonebook.AppConstants.DELETE_CONTACT, phonebook.controller.command.managecontactscmd);

                // register command managecallscmd to handle the GET_CALLS_FOR_ID notification 
                this.facade.registerCommand(phonebook.AppConstants.GET_CALLS_FOR_ID, phonebook.controller.command.managecallscmd);

                // register command managecallscmd to handle the NEW_CALL_FOR_ID notification 
                this.facade.registerCommand(phonebook.AppConstants.NEW_CALL_FOR_ID, phonebook.controller.command.managecallscmd);

                // register command managecallscmd to handle the SAVE_CALL_FOR_ID notification 
                this.facade.registerCommand(phonebook.AppConstants.SAVE_CALL_FOR_ID, phonebook.controller.command.managecallscmd);

                // register command managecallscmd to handle the GET_CALL_FILE notification 
                this.facade.registerCommand(phonebook.AppConstants.GET_CALL_FILE, phonebook.controller.command.managecallscmd);

                // register command managecallscmd to handle the DELETE_CALL notification 
                this.facade.registerCommand(phonebook.AppConstants.DELETE_CALL, phonebook.controller.command.managecallscmd);

            }           
        }
    )
};