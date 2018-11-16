'use strict'
module.exports = function(include, puremvc) {

    puremvc.define(
        // CLASS INFO
        {
            name: 'phonebook.AppConstants'
        },
        // INSTANCE MEMBERS
        {},
        // STATIC MEMBERS
        {
            //Databases
            DB_SRV_URL: 'mongodb://127.0.0.1:27017',
            DB_NAME_AUTH: 'ph_authentication',
            DB_NAME_IMPORTS: 'ph_imports',
            DB_NAME_CONTACTS: 'ph_contacts',
            DB_NAME_CALLS: 'ph_calls',
            //App startup
            STARTUP: 'startup',
            //Database connection
            DB_CONNECT: 'dbConnect',
            DB_CONNECTED: 'dbConnected',
            //Authentication service
            REGISTER_USER: 'registerUser',
            LOGIN_USER: 'loginUser',
            //Import service
            IMPORT_CONTACTS: 'importContacts',
            GET_IMPORT_LOGS_LIST: 'getImportLogsList',
            //Contacts service
            GET_CONTACTS_LIST: 'getContactsList',
            SAVE_CONTACT: 'saveContact',
            EDIT_CONTACT: 'editContact',
            DELETE_CONTACT: 'deleteContact',
            //Calls service
            GET_CALLS_FOR_ID: 'getCallsForId',
            NEW_CALL_FOR_ID: 'newCallForId',
            SAVE_CALL_FOR_ID: 'saveCallForId',
            GET_CALL_FILE: 'getCallFile',
            DELETE_CALL: 'deleteCall',
            //Authentication service response
            USER_REGISTERED: 'userRegistered',
            USER_LOGGED_IN: 'userLoggedIn',
            //Import service response
            IMPORT_CONTACTS_RET: 'importContactsRet',
            IMPORT_LOG_LIST_RET: 'importLogsListRet',
            //Contacts service response
            CONTACTS_LIST_RET: 'contactsListRet', 
            CONTACT_SAVED: 'contactSaved',
            CONTACT_EDITED: 'contactEdited',
            CONTACT_DELETED: 'contactDeleted',
            //Calls service response
            CALLS_FOR_ID_RET: 'callsForIdRet',
            NEW_CALL_FOR_ID_RET: 'newCallForIdRet',
            CALL_FOR_ID_SAVED: 'callForIdSaved',
            CALL_FILE_RET: 'callFileRet',
            CALL_DELETED: 'callDeleted',
            //Host infos
            APP_HOST:'http://127.0.0.1',
            APP_PORT: 3000
        });

}