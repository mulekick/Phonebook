
'use strict'
module.exports = function(include, puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.component.contactcmp',
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
            renderContactForm: function (param, data, id, user) {
                //String literal nested function reference
                let _this = this, html = ``;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body onload = 'bindformevents()'>
                        <form id='viewform' action='${ _this.host }:${ _this.port }/contacts/save' method='post' enctype='multipart/form-data'>
                            <div>                            
                            ${(function(){
                                let content = ``;
                                for (let f of _this.constructor.FIELDS) { 
                                    let {fld, lbl, typ, plc} = f, v = param === "edit" ? fld in data ? data[fld] : "" : "";
                                    content += `
                                    <label for='${ fld }'>${ lbl }</label>
                                    <input type='${ typ }' name='${ fld }' id='${ fld }' placeholder='${ plc }' value = '${ v }' />
                                    `;
                                }
                                return content;
                            })()}                            
                            ${
                                param === "edit" ?
                                    //CSS constraint 
                                    (`<input type='submit' class='btn-small' value='Save contact info'>` +
                                    `<input type='button' class='btn-small' id='createcall' idc='${ id }' value='Create call'>` +
                                    `<input type='button' class='btn-small' id='viewcalls' idc='${ id }' value='View calls'>` +
                                    `<input type='button' class='btn-small' id='deletecontact' idc='${ id }' value='Delete contact'>` +
                                    `<input type='hidden' name='entry_id' id='entry_id' value='${ id }'>`) :
                                    `<input type='submit' class='btn-large' value='Save contact info'>`                           
                            }
                            </div> 
                        </form>
                        <br />
                        <div>Logged in as : ${ user['user_firstname'] } ${ user['user_lastname'] }, last login time : ${ user['lastlogin'] }</div>
                    </body>
                </html>                    
                `;
                //return
                return html;  
            },
            //---------------------------------------------------------------------------------
            renderContactsList: function(contactslist, user) {
                //String literal nested function reference
                let _this = this, html = ``;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body onload = 'bindviewevents()'>
                        <table id='viewlist'>
                            <tr>
                                <th>Full Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                            </tr>                           
                            ${(function(){
                                let content = ``;
                                for (let c of contactslist) {
                                    let 
                                    {entry_id, entry_name, entry_firstname, entry_address1, entry_address2, entry_zipcode, entry_city, entry_phone, entry_mobile} = c,
                                    a = [entry_address1, entry_address2, entry_zipcode, entry_city]
                                        .filter(x => x !== "")
                                        .join("<br />");
                                    content += `
                                    <tr class='entry' id='${ entry_id }'>    
                                        <td>${ entry_name }&nbsp;${ entry_firstname }</td>
                                        <td>${ a }</td>
                                        <td>Office: ${ entry_phone }<br />Mobile: ${ entry_mobile }</td>        
                                    </tr>
                                    `;
                                }
                                return content;   
                            })()}
                        </table>
                        <input type='button' id='createcontact' class='btn-medium' value='Create contact'>
                        <input type='button' id='importcontacts' class='btn-medium' value='Import contacts'>
                        <input type='button' id='viewimportlogs' class='btn-medium' value='View import logs'>
                        <br />
                        <div>Logged in as : ${ user['user_firstname'] } ${ user['user_lastname'] }, last login time : ${ user['lastlogin'] }</div>
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
            NAME: 'contactcmp',
            FIELDS: [{fld:"entry_name",     lbl: "Name",                typ: "text",            plc:"Contact name..."},
                     {fld:"entry_firstname",lbl: "First name",          typ: "text",            plc:"Contact first name..."},
                     {fld:"entry_address1", lbl: "Address 1",           typ: "text",            plc:"Contact adress 1..."},
                     {fld:"entry_address2", lbl: "Address 2",           typ: "text",            plc:"Contact adress 2..."},
                     {fld:"entry_zipcode",  lbl: "Zip code",            typ: "number",          plc:"Contact zip code..."},
                     {fld:"entry_city",     lbl: "City",                typ: "text",            plc:"Contact city..."},
                     {fld:"entry_phone",    lbl: "Phone",               typ: "tel",             plc:"Contact office phone..."},
                     {fld:"entry_mobile",   lbl: "Mobile phone",        typ: "tel",             plc:"Contact mobile phone..."}]
        }
    )

}
