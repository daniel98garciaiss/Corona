const express = require('express');
const router = express.Router();
const request = require('request');
const { connect } = require('mongoose');
const Opc = require('../models/opc');
const opcConfig = require('../config/opc');


function opcHealth(_id)
{
setInterval(function(){
   read(_id);
},10000)
}




//Json : 

var json_test =
{
    "type":"GENERIC_RELAY",
    "typeID": "1",
    "event": "ON"       //  OFF
};

// MODELO
/*
    opc_relay {
    id:1,
    name:'puerta principal',
    actions{
        ON:{
            server:'60dbdf9dd1dd9f39a8898c38',
            key:'Bucket Brigade.Int1'
            value:5
        },
        OFF:{
            server:'60dbdf9dd1dd9f39a8898c37,
            key:'Bucket Brigade.Int2'
            value:6
        }
}

*/

// SECUROS_OBJECT
var obj = 
 {
     '_id': '',
     'name':'relay1',
     'type':'GENERIC_RELAY',
     'typeID':'1',
       'actions':{
        'ON':{
            'server':'',
            'key':'',
            'value':''
        },
        'OFF':{
            'server':'',
            'key':'',
            'value':''
            }
       }
}

//comando a securos
//Cuando el key del server sea igual al text de ON/OFF se envia  http://127.0.0.1:3002/api/securos/event  
/*var json_test =
{
    "type":"GENERIC_RELAY",
    "typeID": "1",
    "event": "ON"       //  OFF
};*/



//form
/*
ON:
server combobox
key: combobox de los methods del server seleccionado
value: 5 text del usuario

OFF:
server combobox
key: combobox de los methods del server seleccionado
value: 6 text del usuario
btn guardar

*/
