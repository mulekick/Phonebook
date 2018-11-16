# Phonebook

## contact management and calls history by contact

My first try at the MEAN stack (MongoDB, Express, Angular, NodeJS), intended as a proof of concept.

Note : 11/16/2018 repository recreated from scratch, since there is a package.json file there is no need to track the node_modules folder

## Technical aspects

09/25/2018 :

- All data are now stored into a MongoDB v3.2 database.
- Now with NodeJS, Express and MongoDB we're on an almost full MEAN stack.

10/09/2018 :

- App was upgraded to a full MVC implementation using npmvc (PureMVC node.js port)
- All the view rendering is done server-side, nonetheless remains fully MVC compliant thanks to npmvc

10/12/2018 :
- File storage in MongoDB upgraded to GridFS

10/28/2018 :
- Deletion functionalities added

11/08/2018 :
- Added contacts import functionality (from csv file)
- Added visualization of import logs

11/16/2018 :
- Added user accounts repository management
- Added server-side user sessions management, including registration, login, logout
- Added session validity checking middleware for all requests except authentication

The following external modules are used :

1. Express.js : Web server framework for NodeJS
2. Morgan.js : For logging HTTP requests on server console
3. Formidable.js : For handling HTTP POST requests containing multipart data
4. Express-formidable.js: Provides shorthand access to Formidable incoming form's fields and files 
5. Mongodb driver v3.1.6 : Access to MongoDB data
6. Npmvc : nodes.js port of the PureMVC framework
7. Mime-types : Automatically generates content-type HTTP response header from file extension
8. express-session : Server-side user sessions management for Express.js
9. connect-mongo : Using MongoDB database as user sessions store
10. bcryptjs : Encryption and decryption of user passwords using blowfish cipher

## What does this application can do as of now :

- Create a new contact
- Edit an existing contact
- View all contacts
- Create a new call for an existing contact and attach a file to it
- View all calls for a given contact and access the attached files
- Delete a call and its attached file if present
- Delete a contact, all its calls and all matching attached files
- Create new contacts from *.csv file through import
- View all imports logs with details on imported data
- Create a new user account
- Log in using an existing account
- Log out

All operations performed follow an asynchronous, non-blocking pattern.

More functionalities are to come ...