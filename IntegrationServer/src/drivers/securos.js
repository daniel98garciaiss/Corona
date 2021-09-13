const express = require('express');
const router = express.Router();
const request = require('request');
const { connect } = require('mongoose');
const relay = require('../models/securos');
const opcConfig = require('../config/opc');


function relayHealth(_id)
{
    setInterval(function(){
        read(_id);
    },10000)
}

async function start()
{
   var relay = await relay.find().lean();
   relay.forEach(element => {
    relayHealth(element._id);
   });
}

async function write(_id)
{
     var opc = await Opc.findById(_id).lean();
    //console.log(opc)
    var newValue = `{"url":"${opc.url}",
                 "var":"${key}",
                 "val":"${value}"
                }`

    return new Promise(json =>{
        var options = {
            'method': 'POST',
            'url': `http://${opcConfig.ip}:${opcConfig.port}${opcConfig.pathWrite}`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: newValue
        };

        request(options, async function (error, res) {
            if (error)
            {
                console.log('Servicio de OPC no responde, ', error);
                return false;
            }
            _json = JSON.parse(res.body)
           
            console.log(_json)
            json(_json)
        });    
    })  
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

//mando a securos
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

// exports.add = add;
// exports.test = test;
exports.start = start;
exports.write = write;
