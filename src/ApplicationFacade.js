//No strict mode here due to PureMVC
//'use strict'
const 
path = require('path'),
express = require('express'),
sessionmgt = require('express-session'),                            //sessions management
MongoStore = require('connect-mongo')(sessionmgt),                  //sever-side sessions storage in a dedicated db
xpformidable = require('express-formidable'),                       //Multipart-data POST requests handler middleware 
logger = require('morgan');                                         //HTTP requests logger

module.exports = function(include,puremvc) {

    // use include te aquire dependency class files
    include("controller/command/_macrocommand");

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.ApplicationFacade',
            parent: puremvc.Facade,

            constructor: function(multitonKey) {
                
                //Mandatory in order not to lose standard facade properties and interfaces
                puremvc.Facade.call(this, multitonKey);

                //Create app
                this.app = express();

                //Load middlewares
                this.app.use(logger('dev'));
                this.app.use(xpformidable({
                    maxFileSize: 1024 * 1024 * 1024 //1 GB max file uploads size
                }));
                this.app.use(sessionmgt({
                    secret: 'blargadeeblargblarg',  // should be a large unguessable string
                    resave: false,                  // connect-mongo implements 'touch' event, so set this to false
                    saveUninitialized: false,       // always set to false
                    cookie: {
                        maxAge: 10 * 60 * 1000,    // cookie expiration time
                    },
                    store: new MongoStore({ url: `${phonebook.AppConstants.DB_SRV_URL}/${phonebook.AppConstants.DB_NAME_AUTH}` })
                }));

                // Serve static files (__dirname = npmvc root directory)
                this.app.use(express.static(path.join(__dirname, 'public'))); 

                //App will start listening to requests once connected to db
                
            }
        },
        // INSTANCE MEMBERS
        {
            startup: function() {
                if (!this.initialized) {
                    this.initialized = true;

                    //Associate the _macrocommand with the STARTUP notification
                    this.registerCommand(phonebook.AppConstants.STARTUP, phonebook.controller.command._macrocommand);

                    //Issue the SETUP notification to execute StartupCommand
                    this.sendNotification(phonebook.AppConstants.STARTUP);

                    //Issue the DB_CONNECT notification
                    this.sendNotification(phonebook.AppConstants.DB_CONNECT);
                }               
            }   
            
        },
        // STATIC MEMBERS
        {
            getInstance: function(multitonKey) {
                var instanceMap = puremvc.Facade.instanceMap;
                instance = instanceMap[multitonKey]; // read from the instance map

                if (instance) // if there is an instance...
                    return instance; // return it
                
                return instanceMap[multitonKey] = new phonebook.ApplicationFacade(multitonKey);
            },
            NAME: 'ApplicationFacade'
        }
    )

};