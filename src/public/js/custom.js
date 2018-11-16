'use strict'
const 
host = "http://127.0.0.1",
port = 3000,
appendform = endpoint => {
        let x = document.createElement("FORM");
        x.setAttribute("action", `${ host }:${ port + endpoint }`);
        x.setAttribute("method", "GET");
        document.body.appendChild(x);
        x.submit();
},
bindviewevents = () => {
    var nl = document.querySelectorAll(".entry");
    for (let i = 0, r = nl[i]; i < nl.length; i++, r = nl[i]) 
        r.onclick = e => appendform(`/contacts/edit/${ r.getAttribute('id')}`);
    (nl = document.querySelector("#createcontact")) ? nl.onclick = e => appendform("/contacts/new/") : false;
    (nl = document.querySelector("#importcontacts")) ? nl.onclick = e => appendform("/import/form/") : false;
    (nl = document.querySelector("#viewimportlogs")) ? nl.onclick = e => appendform("/import/list/") : false;
    var bt = document.querySelectorAll("#deletecall");
    for (let i = 0, r = bt[i]; i < bt.length; i++, r = bt[i]) 
        r.onclick = e => appendform(`/calls/delete/${ r.getAttribute('idc') }/${ r.getAttribute('ts') }`);
},
bindformevents = () => {
    var bt;
    (bt = document.querySelector("#createcall")) ? bt.onclick = e => appendform(`/calls/new/${ bt.getAttribute('idc') }`) : false;
    (bt = document.querySelector("#viewcalls")) ? bt.onclick = e => appendform(`/calls/list/${ bt.getAttribute('idc') }`) : false;
    (bt = document.querySelector("#deletecontact")) ? bt.onclick = e => appendform(`/contacts/delete/${ bt.getAttribute('idc') }`) : false;
    var fileuploads = document.querySelectorAll('.fileupload');
    fileuploads.forEach(fileupload => {
        var lbl = fileupload.nextElementSibling, val = lbl.innerHTML;
        fileupload.onchange = e => {
            let fname;
            lbl.innerHTML = (fname = e.target.value.split( '\\' ).pop()) ? fname : val;
        }
    });
};