const http = require('http')
const express = require('express')
const app = express();
const server = http.createServer(app);

//settings
const configuration = require('./routes/config.js');
const securosNodePort = configuration.securosNodePort;
port = securosNodePort;

//middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json());
//routes
app.use(require('./routes/api'))

//server is listenning
server.listen(port, function(){
console.log("Server init at ",port )

});
