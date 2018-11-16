'use strict'
module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("model/proxy/dbprx");
    include("model/proxy/authenticationprx");
    include("model/proxy/contactprx");
    include("model/proxy/callprx");
    include("model/proxy/importprx");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command._modelcommand',
            parent: puremvc.SimpleCommand
        },
        // INSTANCE MEMBERS
        {
            execute: function(note) {

                // register the db proxy 
                this.facade.registerProxy(new phonebook.model.proxy.dbprx);

                // register the authentication proxy 
                this.facade.registerProxy(new phonebook.model.proxy.authenticationprx);

                // register the contact proxy 
                this.facade.registerProxy(new phonebook.model.proxy.contactprx);

                // register the call proxy 
                this.facade.registerProxy(new phonebook.model.proxy.callprx);

                // register the import proxy
                this.facade.registerProxy(new phonebook.model.proxy.importprx);

            }           
        }
    )
};