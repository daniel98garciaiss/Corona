const express = require('express');
const router = express.Router();
const request = require('request');
const { connect } = require('mongoose');
const Opc = require('../models/opc');
const opcConfig = require('../config/opc');
const Service = require('../models/service');
const socket = require('../index');

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

    var service = await Service.findOne({ name: "opc" }).lean();

    // traer todos los opc para compar mas a adelante a ver si alguno fue modificado
    var opcsBeforeModifications = await Opc.find().lean().sort({name: 'ascending'});

    // console.log(opc)
    return new Promise(json => {
        var options = {
            'method': 'POST',
            'url': `http://${service.ip}:${service.port}${opcConfig.path}`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: `{"url":"${opc.url}"}`
        };

       

        request(options, async function (error, res) {
            if (error)
            {
                console.log('Servicio de OPC no responde, ', error);
                var state = 'Desconectado';
                await Opc.findByIdAndUpdate(_id,{state}).lean();

                var newOpcs = await Opc.find().lean().sort({name: 'ascending'});
                socket.emit("modified-resourse",{newOpcs})
                return false;
            }
            _json = await JSON.parse(res.body)
            if(_json.connect)
            {
                var state = (_json.connect === 'True') ? 'Conectado':'Desconectado';
                
                await Opc.findByIdAndUpdate(_id,{state,methods}).lean();
            }
            
            if(_json.items){
              var methods = _json.items;
              await Opc.findByIdAndUpdate(_id,{methods}).lean();
            }

          var newOpcs = await Opc.find().lean().sort({name: 'ascending'});
            
          if(asyncStringify(opcsBeforeModifications) !== asyncStringify(newOpcs)){
            socket.emit("modified-resourse",{newOpcs})
          }
            // console.log(_json)
            json(_json)
        });    
    })  
}

function asyncStringify(str) {
  return new Promise((resolve, reject) => {
    resolve(JSON.stringify(str));
  });
}

//sin usar aun
async function write(_id,key,value)
{
    var opc = await Opc.findById(_id).lean();
    var service = await Service.findOne({ name: "opc" }).lean();

    //console.log(opc)
    var newValue = `{"url":"${opc.url}",
                 "var":"${key}",
                 "val":"${value}"
                }`

    return new Promise(json =>{
        var options = {
            'method': 'POST',
            'url': `http://${service.ip}:${service.port}${opcConfig.pathWrite}`,
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