'use strict'
module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("view/mediator/dbmdt");
    include("view/mediator/authenticationmdt");
    include("view/mediator/importmdt");
    include("view/mediator/contactmdt");
    include("view/mediator/callmdt");
    include("view/mediator/defaultmdt");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command._viewcommand',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {

                // register db mediator (for database connection)
                this.facade.registerMediator(new phonebook.view.mediator.dbmdt);

                // register /register and /login mediator
                this.facade.registerMediator(new phonebook.view.mediator.authenticationmdt);

                // register /import mediator
                this.facade.registerMediator(new phonebook.view.mediator.importmdt);

                // register /contacts mediator
                this.facade.registerMediator(new phonebook.view.mediator.contactmdt);

                // register /calls mediator
                this.facade.registerMediator(new phonebook.view.mediator.callmdt);

                // register default mediator
                this.facade.registerMediator(new phonebook.view.mediator.defaultmdt);

            }          
        }
    )
};