
'use strict'
module.exports = function(include, puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.component.callcmp',
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
            renderCallForm: function (param, data, id, user) {
                //String literal nested function reference
                let _this = this, html = ``;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body onload = 'bindformevents()'>                
                        <form id='viewform' action='${ _this.host }:${ _this.port }/calls/save' method='post' enctype='multipart/form-data'>
                        <div>                            
                        ${(function(){
                            let content = ``;
                            for (let f of _this.constructor.FIELDS) { 
                                let {fld, lbl, typ, plc} = f;
                                content += `
                                <label for='${ fld }'>${ lbl }</label>
                                ${
                                    typ === "textarea" ? 
                                        `<textarea name='${ fld }' id='${ fld }' placeholder='${ plc }' rows='3' cols='33' maxlength='200' wrap='hard'></textarea>` : 
                                    typ === "file" ?
                                        `</div>
                                        <div class='divfile'>
                                            <input type='${ typ }' name='${ fld }' id='${ fld }' class='fileupload' />
                                            <label for='${ fld }'>${ plc }</label>
                                        </div>
                                        <div>` :
                                    `<input type='${ typ }' name='${ fld }' id='${ fld }' placeholder='${ plc }' />`
                                }
                                `;
                            }
                            return content;
                        })()}
                            <input type='submit' class='btn-large' value='Save call'>
                            <input type='hidden' name='call_id' id='call_id' value='${ id }'>
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
            renderCallsList: function(callslist, user) {
                let _this = this, html = ``, d;
                html += `
                <html>
                   <head>
                       <link rel='stylesheet' href='/css/custom.css'>
                       <script type='text/javascript' src='/js/custom.js'></script>
                   </head>
                   <body onload = 'bindviewevents()'>
                       <table id='viewlist'>
                           <tr>
                               <th>Date and time</th>
                               <th>Duration (mn)</th>
                               <th>Details</th>
                               <th>Link to file</th>
                               <th>&nbsp;</th>
                           </tr>
                           ${(function(){
                            let content = ``;
                            for (let c of callslist) { 
                                let {call_datetime, call_duration, call_subject, call_file, call_id, call_timestamp} = c;
                                content += `
                                <tr> 
                                    <td>${ (d = new Date(call_datetime)).toDateString() } ${ d.toTimeString().slice(0, 8) }</td>
                                    <td>${ call_duration }</td>
                                    <td>${ call_subject }</td>
                                    <td>${ (call_file !== null ? `<a href = '/calls/file/${ call_id }/${ call_timestamp }'>${ call_file["file_name"] }</a>` : `&nbsp;`) }</td>         
                                    <td><input type='button' class='btn-large' id='deletecall' idc='${ call_id }' ts='${ call_timestamp }' value='Delete'></td>   
                                </tr>
                                `;
                            }
                            return content;
                        })()}
                       </table>
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
            NAME: 'callcmp',
            FIELDS: [{fld:"call_datetime",  lbl: "Date and time",       typ: "datetime-local",  plc: ""},
                     {fld:"call_duration",  lbl: "Duration (minutes)",  typ: "number",          plc:"Call duration..."},
                     {fld:"call_file",      lbl: "Document",            typ: "file",            plc:"Attach file..."},
                     {fld:"call_subject",   lbl: "Subject",             typ: "textarea",        plc:"Call subject..."}]
        }
    )

}
