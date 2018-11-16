'use strict'
module.exports = function(include, puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.mediator.defaultmdt',
            parent: puremvc.Mediator
        },
        
        // INSTANCE MEMBERS
        {
            onRegister: function() {

                //Default mediator, handles root route redirection and blank default route 
                //(mandatory for express.static serving of public files....)
                //Requests are matched to routes according to the registration order of the mediators

                //Reference express app through application facade
                //---------------------------------------------------------------------------------     
                //Handle root request
                this.facade.app.all('/', function (req, res) {
                    //Redirect to contacts list
                    res.status(200).redirect('/contacts/list');
                });
                //---------------------------------------------------------------------------------
                //Handle unmanaged requests
                this.facade.app.all('*', function (req, res) {
                    //This specific route conflicts with express.static when returning a 404...
                    //res.status(404).send('<p>The action you requested is not managed</p>');
                });
                //---------------------------------------------------------------------------------
            },  

            listNotificationInterests: function() {
                return []
            },

            handleNotification: function(note) {},          
            
            onRemove: function() {}
        },
        
        // STATIC MEMBERS
        {
            NAME: 'defaultmdt'
        }
    );

}