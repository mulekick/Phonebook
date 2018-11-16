const puremvc = require("npmvc");
 
puremvc.setSourceDir(__dirname + "/src");
puremvc.include("AppConstants");
puremvc.include("ApplicationFacade");
 
// make instance of ApplicationFacade and trigger start command
var mvc = phonebook.ApplicationFacade.getInstance(phonebook.ApplicationFacade.NAME);
mvc.startup();