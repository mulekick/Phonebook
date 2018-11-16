
'use strict'
module.exports = function(include, puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.component.authenticationcmp',
            constructor: function () {
                this.host = phonebook.AppConstants.APP_HOST;
                this.port = phonebook.AppConstants.APP_PORT;
            }
        },

        // INSTANCE MEMBERS 
        {
            //---------------------------------------------------------------------------------
            port: null,

            host: null,
            //---------------------------------------------------------------------------------
            renderRegistrationForm: function (param, data, id) {
                //String literal nested function reference
                let _this = this, html = ``;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body onload = 'bindformevents()'>
                        <form id='viewform' action='${ _this.host }:${ _this.port }/register' method='post' enctype='multipart/form-data'>
                            <div>                            
                            ${(function(){
                                let content = ``;
                                for (let f of _this.constructor.FIELDS_REGISTER) { 
                                    let {fld, lbl, typ, plc} = f, v = param === "edit" ? fld in data ? data[fld] : "" : "";
                                    content += `
                                    <label for='${ fld }'>${ lbl }</label>
                                    <input type='${ typ }' name='${ fld }' id='${ fld }' placeholder='${ plc }' value = '${ v }' />
                                    `;
                                }
                                return content;
                            })()}  
                            <input type='submit' class='btn-large' value='Create my account'> 
                            </div> 
                        </form>
                    </body>
                </html>                    
                `;
                //return
                return html;  
            },
            //---------------------------------------------------------------------------------
            renderLoginForm: function (param, data, id) {
                //String literal nested function reference
                let _this = this, html = ``;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body onload = 'bindformevents()'>
                        <form id='viewform' action='${ _this.host }:${ _this.port }/login' method='post' enctype='multipart/form-data'>
                            <div>                            
                            ${(function(){
                                let content = ``;
                                for (let f of _this.constructor.FIELDS_LOGIN) { 
                                    let {fld, lbl, typ, plc} = f, v = param === "edit" ? fld in data ? data[fld] : "" : "";
                                    content += `
                                    <label for='${ fld }'>${ lbl }</label>
                                    <input type='${ typ }' name='${ fld }' id='${ fld }' placeholder='${ plc }' value = '${ v }' />
                                    `;
                                }
                                return content;
                            })()}  
                            <input type='submit' class='btn-large' value='Log in'> 
                            </div> 
                        </form>
                    </body>
                </html>                    
                `;
                //return
                return html;  
            }
            //---------------------------------------------------------------------------------
        },
        
        // STATIC MEMBERS   
        {
            NAME: 'authenticationcmp',
            FIELDS_REGISTER: [{fld:"user_firstname", lbl: "First name",  typ: "text",        plc:"Your first name..."},
                              {fld:"user_lastname",  lbl: "Last name",   typ: "text",        plc:"Your last name..."},
                              {fld:"user_id",        lbl: "User ID",     typ: "text",        plc:"Your user ID..."},
                              {fld:"user_password",  lbl: "Password",    typ: "password",    plc:"Your password..."}],
            FIELDS_LOGIN:    [{fld:"user_id",        lbl: "User ID",     typ: "text",        plc:"Your user ID..."},
                              {fld:"user_password",  lbl: "Password",    typ: "password",    plc:"Your password..."}]
        }
    )

}
