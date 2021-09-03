const securos = require('securos');
const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require ('fs');
var Regex = require("regex");


router.get('/api/securos/', (req,res) => {
   res.send('Connected to SecurOS External systems Api')
});

router.post('/api/securos/event', (req,res) =>{
    console.log(req.body);
    var json = JSON.stringify(req.body);
    var parsedJson = JSON.parse(json);
    var SecurosComment = '', SecurosEvent  = '', SecurosRecType  = '',
     SecurosRecId  = '', SecurosParType  = '', SecurosParId  = '', SecurosPanelType  = '', SecurosPanelId  = '',
     SecurosSenType = '', SecurosSenId = '', type = '' , id = '' , Event = '' , comment = '' ;
    for (var keys in parsedJson) {

            console.log( keys+": "+ parsedJson[keys]);
            switch (keys){
                case "event_code":
                        SecurosComment = SecurosComment+ ' ' + parsedJson[keys];
                        break
                case "comment":
                        SecurosComment = SecurosComment+ ' ' +parsedJson[keys];
                        break
                case "event":
                        SecurosEvent = parsedJson[keys];
                        break
                case "receiver":
                        SecurosRecType = "RECEIVER"
                        SecurosRecId = parsedJson[keys]
                    break
                case "partition":
                        SecurosParType = "PARTITION"
                        SecurosParId = parsedJson[keys]
                    break
                case "panel":
                        SecurosPanelType = "PANEL"
                        SecurosPanelId = parsedJson[keys]
                    break
                case "sensor":
                        SecurosSenType = "SENSOR"
                        SecurosSenId = parsedJson[keys]
                    break
                case "type":
                        type = parsedJson[keys]
                    break
                case "typeID":
                        id = parsedJson[keys]
                    break

            }
    }

    //Priority
    comment = SecurosComment;
    Event = SecurosEvent;
    if (SecurosSenType != ''){
        type = SecurosSenType
        id = SecurosSenId

    }
    else if (SecurosParType != '' && SecurosSenType == ''){
        type = SecurosParType
        id = SecurosParId

    }
    else if (SecurosPanelType != '' && SecurosParType == '' && SecurosSenType == ''){
        type = SecurosPanelType
        id = SecurosPanelId

    }
    else if (SecurosRecType != '' && SecurosPanelType == '' && SecurosParType == '' && SecurosSenType == ''){
        type = SecurosRecType
        id = SecurosRecId

    }
    else if(type != '' && id != '' && SecurosRecType == '' && SecurosPanelType == '' && SecurosParType == '' && SecurosSenType == ''){
            type = type
            id = id
    }
    securos.connect( async function (core) {
        console.log(type,id,Event,comment )
        core.sendEvent(type,id,Event,{'comment':comment});
    })
    res.send('ok')
})

router.get('/api/securos/item', (req,res) =>{
    const {type,id} = req.body; 
    pg.query("SELECT * FROM \"OBJ_"+type+"\" WHERE id = \'"+id+"\'", function(resp)
    {       
        console.log(resp.rows);
        res.send(resp.rows);
       
    });
});    

router.get('/api/securos/allItems', (req,res) =>{
    const {type,id} = req.body; 
    Items.getItems();
    res.send("OK");
}); 


router.get('/api/securos/items/area/:id', (req,res) =>{

const {type,id,action} = req.body;
    securos.connect( async function (core) {
        //GETCHILDRENcore.(type,id,action)
        //Construir json
        var json ;
        res.send(json)
    })

})

router.post('/api/securos/react', (req,res) =>{

const {type,id,action} = req.body;
    securos.connect( async function (core) {
        core.doReact(type,id,action)
        res.send('ok')
    })


})

function regularExpression(text, regexp){

    //var re = new RegExp(/(OBJ_+\w+)/g);
    var re = new RegExp(regexp);
    var r  = text.match(re);
    //console.log(r.length);
    r.forEach(element => {
            console.log(element);
        });
    return r;
}

test2();
function test2(){
    console.log('test2');
    securos.connect( async function (core) {
    core.registerEventHandler("GENERIC_SENSOR","*","ACTVATED",eventHandler)
    core.registerEventHandler('GENERIC_RELAY','*',"*",eventHandler)
    core.registerEventHandler("GENERIC_AREA","*","AREA_ARMED",eventHandler)
    //core.registerEventHandler('MACRO','*',"RUN",eventHandler)
    });
}

function eventHandler(e){
console.log(e);
 var options = {
      'method': 'POST',
      'url': 'http://127.0.0.1:3002/api/securos/',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"type":"GENERIC_SENSOR","id":"1","action":"ALARMED"})
      //body: JSON.stringify(e)
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });

}

module.exports = router;