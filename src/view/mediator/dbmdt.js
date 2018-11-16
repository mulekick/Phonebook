'use strict'

module.exports = function(include, puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.mediator.dbmdt',
            parent: puremvc.Mediator
        },
        
        // INSTANCE MEMBERS
        {
            onRegister: function() {},  

            listNotificationInterests: function() {
                return [phonebook.AppConstants.DB_CONNECTED]
            },

            handleNotification: function(note) {
                //Extract properties via object destructuring
                let {valid, msg, data} = note.getBody();
                //Process proxy response                
                console.log(msg); 
                if (!valid) {
                    //Init app facade properties with null values
                    Object.assign(this.facade, data);
                    //DB connection failed, the service should not be started then ...
                } else {
                    switch(note.getName()) {
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.DB_CONNECTED :
                            //Store db collections in app facade properties
                            Object.assign(this.facade, data);                            
                            //DB connection was successful, open service to requests ...
                            this.facade.app.listen(phonebook.AppConstants.APP_PORT);
                            console.log(`Listening on port ${ phonebook.AppConstants.APP_PORT }`);
                            break;
                        //-----------------------------------------------------------------------------
                        default:
                            break;
                        //-----------------------------------------------------------------------------
                    }
                }
            },          
            
            onRemove: function() {}
        },
        
        // STATIC MEMBERS
        {
            NAME: 'dbmdt'
        }
    );

}