# Assignment3
## INSTRUCTION TO RUN 

1. `cd assignment3` to go to the project directory
2. Run `npm install` to install all the dependencies
3. Run `npm install -g @angular/cli` to install angular cli
4. Run `npm install bootstrap` and `npm install @ng-bootstrap/ng-bootstrap` if UI not working properly and check dependency in angular.json, ensuring the styles looks like this:
"styles": [
   "src/styles.css",
   "node_modules/bootstrap/dist/css/bootstrap.min.css"
   ] 
5. `ng build --watch` to build the project and watch for changes
6. `cd backend` to go to the backend directory
7. `nodemon server.js` to run the server and watch for changes
8. Notes that the following code will run once everything the server is running. If Mac User please change the path to the service-account-file.json in the server.js file to use 
9. export GOOGLE_APPLICATION_CREDENTIALS=service-account-file.json
   ```javascript
   if (isLocal) {
   // Local path
   process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../service-account-file.json');
   } else {
   // VM path
   process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'service-account-file-be.json');
   }
    ``` 

