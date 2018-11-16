'use strict'
module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("controller/command/_controllercommand");
    include("controller/command/_viewcommand");
    include("controller/command/_modelcommand");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.controller.command._macrocommand',
            parent: puremvc.MacroCommand
        },
        // INSTANCE MEMBERS
        {
            initializeMacroCommand: function () {

                // add the _controllercommand- it will register Commands with the Facade
                this.addSubCommand(phonebook.controller.command._controllercommand);        

                // add the _viewcommand- it will register Mediators with the Facade
                this.addSubCommand(phonebook.controller.command._viewcommand);          

                // add the _modelcommand- it will register Proxys with the Facade
                this.addSubCommand(phonebook.controller.command._modelcommand);
                
            }   
            
        }
    )
};