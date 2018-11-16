
'use strict'
module.exports = function(include, puremvc) {

    // ---> now you can use puremvc.define to define class
    puremvc.define
    (
        // CLASS INFO
        {
            name: 'phonebook.view.component.importcmp',
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
            renderImportForm: function (user) {
                //String literal nested function reference
                let _this = this, html = ``;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body onload = 'bindformevents()'>                
                        <form id='viewform' action='${ _this.host }:${ _this.port }/import/launch' method='post' enctype='multipart/form-data'>
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
                            <input type='submit' class='btn-large' value='Launch import'>
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
            renderImportLogsList: function(logslist, user) {
                //String literal nested function reference
                let _this = this, html = ``, d;
                html += `
                <html>
                    <head>
                        <link rel='stylesheet' href='/css/custom.css'>
                        <script type='text/javascript' src='/js/custom.js'></script>
                    </head>
                    <body>
                        <table id='viewlist'>
                            <tr>
                                <th>Date</th>
                                <th>Details</th>
                            </tr>
                            ${(function(){
                                let content = ``;
                                for (let l of logslist) {
                                    let {log_date, log_user, log_comments, log_details} = l;
                                    content += `
                                    <tr>    
                                        <td>${ (d = new Date(log_date)).toDateString() } ${ d.toTimeString().slice(0, 8) }</td>
                                        <td>
                                            <b>Author :</b><br />${ log_user }<br /><br />
                                            <b>Details :</b><br />${ log_details.replace(/\r\n/g, "<br />") }<br /><br />
                                            <b>Comments :</b><br />${ log_comments.replace(/\r\n/g, "<br />") }
                                        </td>        
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
            NAME: 'importcmp',
            FIELDS: [{fld:"import_comments",lbl: "Comments",            typ: "textarea",        plc:"Type comments..."},
                     {fld:"import_file",    lbl: "File to import",      typ: "file",            plc:"Attach file..."}]
        }
    )

}
