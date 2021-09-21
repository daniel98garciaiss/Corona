const securos = require('securos');
const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require ('fs');
var Regex = require("regex");
var TreeArray =[];

router.get('/api/securos/', (req,res) => {
   res.send('Connected to SecurOS External systems Api')
});

router.post('/api/securos/event', (req,res) =>{
    //console.log(req.body);
    var json = JSON.stringify(req.body);
    var parsedJson = JSON.parse(json);
    var SecurosComment = '', SecurosEvent  = '', SecurosRecType  = '',
     SecurosRecId  = '', SecurosParType  = '', SecurosParId  = '', SecurosPanelType  = '', SecurosPanelId  = '',
     SecurosSenType = '', SecurosSenId = '', type = '' , id = '' , Event = '' , comment = '' ;
    for (var keys in parsedJson) {

            //console.log( keys+": "+ parsedJson[keys]);
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
        //console.log(type,id,Event,comment )
        core.sendEvent(type,id,Event,{'comment':comment});
        core.disconnect();
    })
    res.send('ok')
})

router.get('/api/securos/item', (req,res) =>{
    const {type} = req.body; 
    securos.connect( async function (core) {
        let objectsIds = await core.getObjectsIds(type);
        objectsIds.forEach(id => {
                /*getObject
                let object = await core.getObject(type, id);
                try{
                    var json = JSON.stringify(object);
                    var parsedJson = JSON.parse(json);
                    if(parsedJson != null  && parsedJson != undefined)
                    {
                        console.log(parsedJson);
                    }
                }catch(error){
                        console.error(error);
                } */

        });
        core.disconnect();
        res.send('ok')
    });
    /*pg.query("SELECT * FROM \"OBJ_"+type+"\" WHERE id = \'"+id+"\'", function(resp)
    {       
        console.log(resp.rows);
        res.send(resp.rows);
       
    });*/
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
        core.disconnect();
        res.send(json)
    })

})

router.post('/api/securos/react', (req,res) =>{
    const {type,id,action} = req.body;
    securos.connect( async function (core) {
        core.doReact(type,id,action)
        core.disconnect();
        res.send('ok')
    })


})

function regularExpression(text, regexp){
    var re = new RegExp(regexp);
    //console.log(re);
    var r  = text.match(re);
    //console.log(r);
    if(r != null){
        //console.log(r.length);
        r.forEach(element => {
            //console.log(element);
        });
        return r;
    }
    else 
        return "";
}

router.post('/api/securos/eventreact', (req,res) =>{
    //console.log(req.body);
    const {type,id,action} = req.body;
    //console.log(type, id, action);
    var react = regularExpression(action, "\\w+(?=REACT)");

    TreeArray = {};

    securos.connect( async function (core) {
        let object = await core.getObject(type, id);
        try{
                var json = JSON.stringify(object);
                var parsedJson = JSON.parse(json);
                if(parsedJson != null  && parsedJson != undefined)
                {
                    //console.log(parsedJson);
                    //console.log("parentId",parsedJson.parentId, "parentType", parsedJson.parentType );
                    if(parsedJson.Type !=  'EXTERNAL_SYSTEMS' && parsedJson.Type != 'INTEGRATION' && parsedJson.Type != 'SLAVE'  && parsedJson.Type != 'MAIN'){
                        
                        TreeArray.react = react[0];
                        TreeArray.name =  parsedJson.name;
                        TreeArray.id =  parsedJson.id;
                        TreeArray.type = parsedJson.Type;

                                              

                        getObjectTree(parsedJson.parentId ,parsedJson.parentType,TreeArray);
                        

                        
                    }
                }
        }  
        catch(error){
                console.error(error);
        } 
        res.send(ok);
    })

})
function getObjectTree(parentId,parentType,TreeArray){

        securos.connect( async function (core) {
            if(TreeArray.parent.type != 'EXTERNAL_SYSTEMS' ){
                let object = await core.getObject(parentType, parentId);
                try{
                        var json = JSON.stringify(object);
                        var parsedJson = JSON.parse(json);
                        if(parsedJson != null  && parsedJson != undefined)
                        {
                            var newParent ={}
                            newParent.id =parentId
                            newParent.type = parentType;
                            newParent.name = parsedJson.name
                            TreeArray.parent = newParent;
                            //console.log(parsedJson);
                            //console.log("parentId",parsedJson.parentId, "parentType", parsedJson.parentType );
                            getObjectTree(parsedJson.parentId, parsedJson.parentType,  TreeArray.parent);
                        }

                }  
                catch(error){
                        reject(error);
                        console.error(error);
                } 
            }
            else{
                console.log(JSON.stringify(TreeArray))
            }

        })
        console.log(TreeArray);
}

function eventHandlerReact(e){
console.log('eventHandlerReact',e);
 var options = {
      'method': 'POST',
      'url': 'http://127.0.0.1:3002/api/securos/react',
      'headers': {
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify({"type":"GENERIC_SENSOR","id":"1","action":"ALARMED"})
      body: JSON.stringify(e)
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
    });

}

module.exports = router;