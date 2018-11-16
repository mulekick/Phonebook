'use strict'
//Load modules
const
bcrypt = require('bcryptjs'),                   //Native bcrypt crashes the app when calling async encryption, switching to bcryptjs
nsalt = 10;

let _this;

module.exports = function(include,puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.model.proxy.authenticationprx',
            parent: puremvc.Proxy
        },
        // INSTANCE MEMBERS
        {
            //---------------------------------------------------------------------------------
            //Send notifications
            sendProxyResponse: function(notificationid, ret) {
                //Mandatory for enforcing strict mode with object destructuring
                let req, res, status, valid, msg, data;
                //Extract properties via object destructuring
                this.sendNotification(notificationid, {req, res, status, valid, msg, data} = ret);
            },
            //---------------------------------------------------------------------------------
            onRegister: function() {
                
                //Callback function reference
                _this = this;

            },
            //---------------------------------------------------------------------------------
            registerUser: function(data)  {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res}, d,
                hashpassword = () => 
                    new Promise((resolve, reject) => {
                        let {user_password} = fields;    
                        //Hash password
                        bcrypt.hash(user_password, nsalt, (err, hash) => {  
                            if (err) {
                                Object.assign(ret, {status: 500, valid: false, msg: `user password encryption failed for ${ fields['user_firstname'] } ${ fields['user_lastname'] }`, data: null});
                                reject();
                            } else {
                                resolve(hash);
                            }
                        });
                    }),
                createuser = hash =>
                    new Promise((resolve, reject) => {
                        //Replace user password with hashed version
                        Object.assign(fields, {user_password: hash});
                        //create user, given user infos
                        this.facade.userdata.insertOne(
                            fields, 
                            {w : 1},
                            function (err, result) {
                                //Extract mongodb raw results, only on write/delete operations
                                let {ok, n} = result['result'];   
                                if (err || !ok) {
                                    Object.assign(ret, {status: 500, valid: false, msg: `error saving user data for ${ fields['user_firstname'] } ${ fields['user_lastname'] }`, data: null});
                                    reject();
                                } else {
                                    Object.assign(ret, {status: 200, valid: true, msg: `successfully created new user ${ fields['user_firstname'] } ${ fields['user_lastname'] }`, data: null});
                                    resolve(fields);
                                }
                            }); 
                    }),
                createsession = fields => {
                        //Save last login time
                        fields['lastlogin'] = `${ (d = new Date()).toDateString() } ${ d.toTimeString().slice(0, 8) }`;
                        //Creates server-side session when accessing req.session, saving everything in the session store
                        //Creates 'Set-Cookie' header containing server-side session id in HTTP response
                        req.session.user = fields;     
                        //Server-side session save is automatically called at the end of the HTTP response if the session data has been altered

                        //Send notification (SUCCESS)   
                        _this.sendProxyResponse(phonebook.AppConstants.USER_REGISTERED, ret); 
                    },
                raiseerror = err => 
                    //Send notification (FAILURE) 
                    _this.sendProxyResponse(phonebook.AppConstants.USER_REGISTERED, ret);

                //Running promise chain
                hashpassword()
                    .then(hash => createuser(hash))
                    .then(fields => createsession(fields))
                    .catch(raiseerror);	
            },
            //---------------------------------------------------------------------------------
            loginUser: function(data)  {
                //Extract properties via object destructuring
                let {req, res} = data, {params, fields, files} = req, ret = {req: req, res: res}, d,
                finduser = () => 
                    new Promise((resolve, reject) => {
                        let {user_id} = fields;
                        //Verify user credentials            
                        this.facade.userdata.findOne({'user_id': user_id}, function (err, result) {
                            if (err) {
                                Object.assign(ret, {status: 500, valid: false, msg: `error logging user : ${ user_id } : database returned an error`, data: null});
                                reject();
                            } else if (result === null) {
                                Object.assign(ret, {status: 401, valid: false, msg: `error logging user : ${ user_id } : user not found in database`, data: null});
                                reject();
                            } else {
                                resolve(result);
                            };
                        });
                    }),
                comparepassword = result => 
                    new Promise((resolve, reject) => {
                        let {user_id, user_password} = fields;    
                        //Use bcrypt to compare user password with stored hash
                        bcrypt.compare(user_password, result['user_password'], (err, match) => {
                            if (!match) {
                                Object.assign(ret, {status: 401, valid: false, msg: `error logging user : ${ user_id } : wrong password`, data: null});
                                reject();
                            } else {
                                Object.assign(ret, {status: 200, valid: true, msg: `successfully logged in : welcome ${ result['user_firstname'] } ${ result['user_lastname'] }`, data: null});
                                resolve(result);
                            };
                        });
                    }),
                createsession = result => {
                        //Save last login time
                        result['lastlogin'] = `${ (d = new Date()).toDateString() } ${ d.toTimeString().slice(0, 8) }`;
                        //Creates server-side session when accessing req.session, saving everything in the session store
                        //Creates 'Set-Cookie' header containing server-side session id in HTTP response
                        req.session.user = result;     
                        //Server-side session save is automatically called at the end of the HTTP response if the session data has been altered

                        //Send notification (SUCCESS)   
                        _this.sendProxyResponse(phonebook.AppConstants.USER_LOGGED_IN, ret); 
                    },
                raiseerror = err => 
                    //Send notification (FAILURE) 
                    _this.sendProxyResponse(phonebook.AppConstants.USER_LOGGED_IN, ret);

                //Running promise chain
                finduser()
                    .then(result => comparepassword(result))
                    .then(result => createsession(result))
                    .catch(raiseerror);	
            }
        },
        // CLASS MEMBERS    
        {
            NAME: 'authenticationprx'
        }
    )
};