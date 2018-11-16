'use strict'

module.exports = function(include, puremvc) {

    // use include te aquire dependency class files
    include("view/component/authenticationcmp");

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.mediator.authenticationmdt',
            parent: puremvc.Mediator
        },
        
        // INSTANCE MEMBERS
        {
            onRegister: function() {

                // Initialize the contacts view component
                this.setViewComponent(new phonebook.view.component.authenticationcmp);
                
                //Callback function reference
                let _this = this;

                //Reference express app through application facade  
                //---------------------------------------------------------------------------------
                //Route for user registration
                this.facade.app.route('/register')
                    //Form
                    .get((req, res) => {    
                        //Render dynamic form, load HTTP POST form action
                        return res.status(200).send(_this.viewComponent.renderRegistrationForm(true, null, null));
                    })
                    //Submit
                    .post((req, res) => {
                        //Passing request and result to proxy to preserve object reference in notification handling
                        let data = {req: req, res: res};
                        //Notify > command > proxy
                        _this.sendNotification(phonebook.AppConstants.REGISTER_USER, data);
                    });
                //---------------------------------------------------------------------------------
                //Route for user login
                this.facade.app.route('/login')
                    //Form
                    .get((req, res) => {    
                        //Render dynamic form, load HTTP POST form action
                        return res.status(200).send(_this.viewComponent.renderLoginForm(true, null, null));
                    })
                    //Submit
                    .post((req, res) => {
                        //Passing request and result to proxy to preserve object reference in notification handling
                        let data = {req: req, res: res};
                        //Notify > command > proxy
                        _this.sendNotification(phonebook.AppConstants.LOGIN_USER, data);
                    });
                //---------------------------------------------------------------------------------
                //Session checking middleware
                this.facade.app.use((req, res, next) => {
                    console.log(`verifying user credentials`);
                    //Access the server-side session as req.session, saving everything in the session store
                    //Check if session id ('Cookie' header in HTTP request) matches a server-side session
                    if (req.session && req.session.user) {
                        //Session is valid, hand request processing to next middleware
                        next();
                    } else {
                        //No 'session' cookie is present in HTTP request, deny access
                        let err;
                        console.log(err = `no valid user session for ${ req.url } : access denied`);
                        //End request/response cycle
                        return res.status(401).send(`<p>${ err }</p>`);
                        //Redirect to login screen
                        //return res.redirect('/login');
                    }
                });
                //---------------------------------------------------------------------------------
                //Route for user logout
                this.facade.app.get('/logout', (req, res) => {
                    //Reset session infos
                    req.session.destroy();
                    //End request/response cycle
                    return res.redirect('/login');
                });
                //---------------------------------------------------------------------------------
            },  

            listNotificationInterests: function() {
                return [phonebook.AppConstants.USER_REGISTERED,
                        phonebook.AppConstants.USER_LOGGED_IN]
            },

            handleNotification: function(note) {
                //Extract properties via object destructuring
                let {req, res, status, valid, msg, data} = note.getBody();
                //Process proxy response                
                console.log(msg); 
                if (!valid) {
                    res.status(status).send('<p>' + msg + '</p>');
                } else {
                    switch(note.getName()) {
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.USER_REGISTERED :
                            res.status(status).redirect('/contacts/list');
                            break;
                        //-----------------------------------------------------------------------------
                        case phonebook.AppConstants.USER_LOGGED_IN :
                            res.status(status).redirect('/contacts/list');
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
            NAME: 'authenticationmdt'
        }
    );

}