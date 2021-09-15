const express = require('express');
const router = express.Router();
const request = require('request');
const { connect } = require('mongoose');
const Opc = require('../models/opc');
const opcConfig = require('../config/opc');

async function add(_id)
{
    read(_id);
    opcHealth(_id);
}

async function start()
{
   var opc = await Opc.find().lean();
   opc.forEach(element => {
      opcHealth(element._id);
   });
}


x = {
  aInternal: 10,
  aListener: function(val) {},
  set a(val) {
    if(val!=this.aInternal){
      this.aInternal = val;
      this.aListener(val);
    }
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener;
  }
}

x.registerListener(function(val) {
  console.log("Someone changed the value of x.a to " + val);
});

function test()
{
  x.a = 20;
    var options = {
      'method': 'POST',
      'url': 'http://127.0.0.1:3001/api/securos/event',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"type":"GENERIC_SENSOR","id":"1","action":"ALARMED"})

    };
    /*request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });*/
}

function opcHealth(_id)
{
setInterval(function(){
   read(_id);
},10000)
}


async function read(_id)
{
    var opc = await Opc.findById(_id).lean();
    //console.log(opc)
    return new Promise(json =>{
        var options = {
            'method': 'POST',
            'url': `http://${opcConfig.ip}:${opcConfig.port}${opcConfig.path}`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: `{"url":"${opc.url}"}`
        };

        request(options, async function (error, res) {
            if (error)
            {
                console.log('Servicio de OPC no responde, ', error);
                return false;
            }
            _json = JSON.parse(res.body)
            if(_json.connect)
            {
                var state = (_json.connect === 'True') ? 'Conectado':'Desconectado';
                await Opc.findByIdAndUpdate(_id,{state,methods});
            }
            if(_json.items){
            var methods = _json.items;
            await Opc.findByIdAndUpdate(_id,{methods});
            }
            // console.log(_json)
            json(_json)
        });    
    })  
}

//sin usar aun
async function write(_id,key,value)
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
           
            // console.log(_json)
            json(_json)
        });    
    })  
}


exports.add = add;
exports.test = test;
exports.start = start;
exports.write = write;