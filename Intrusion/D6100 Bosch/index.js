/* 
 *SECUROS INTEGRATION SERVER - INTRUSION MODULE - D6100 Bosch
 *@Authors: 
 *			Alejandra Aguirre  - alejandra.aguirre@issivs.com
 *			Santiago Rondon    - santiago@ivsss.com
 *			Alejandro Garcia   - alejandro@issivs.com
 *Version 1.0 
 *SecurOS 10.9
 *
*/
const csv = require('csvtojson');
var request = require('request');
var udp = require('dgram');
var buffer = require('buffer');
var client = udp.createSocket('udp4');
var data = Buffer.from('siddheshrane');
const message = Buffer.from('Some bytes');


read_csv(function(){
    console.log("Message CSV successfully read");
    
    client.bind(7700);
    console.log('Connected');
    
});


client.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  //client.close();
});

client.on('message', (msg, rinfo) => {
    var data1 = Buffer.from(msg).toString('utf8');
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}, ${rinfo.size}, ${rinfo.family},${data1}`);
  var data2 = data1.split(' ');
  if(data2.length>2)
  {
    console.log("internal message");
    var buff = Buffer.from([6]);
   client.send(buff, 7700, '192.168.0.74', (err) => {
    });
  }
  else
  {
    
    var str2 = JSON.stringify(data2[1]).replace(/[\\u]/g, "");
    var data3 = str2.replace("0014", "");
    var data3 = data3.replace('"', "");
    var data3 = data3.replace('"', "");
    
    console.log("data3",data3)
    var receiver = data2[0];
    var panel = data3.substring(0,4);
    var clasifier = data3.substring(6,7)
    var event_code = data3.substring(7,10);
    var partition = data3.substring(10,12);
    var contact = data3.substring(12,15);
    console.log(receiver,panel,clasifier,event_code,partition,contact);
    var [event,type] = find_message(event_code);
    console.log(event,type);
            if(event==undefined)
                event="Evento no registrado";
            if(type==undefined)
                type="INFO";
  
  var event_type="";
  if(clasifier==3)
  {
    event_type = "Restore ";
    type="EVENT";
  }
  else if(clasifier==3)
    event_type = "Previous event ";

   //client.send(msg, 0, msg.length, rinfo.address);
   var buff = Buffer.from([6]);
   client.send(buff, 7700, '192.168.0.74', (err) => {
  });


   json = {
                "receiver":receiver,
                "panel": panel,
                "cid":"1234",
                "event_code":event_code,
                "comment":event_type+event,
                "event":type,
                "partition": partition,
                "sensor": contact
            }
            console.log(json);
            var options = {
            'method': 'POST',
            'url': 'http://192.168.1.148:3015/api/securos/event',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json) //JSON.stringify({"receiver":"1","panel":"1752","cid":"18","event_code":"E401","comment":"not found","event":"ALARM","partition":"49","sensor":"1","type":"SENSOR","typeID":"1"})
            };
    request(options, function(error, response) {
        if (error) throw new Error(error);
            console.log(response.body);
    });
}    
});

client.on('listening', () => {
  const address = client.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

function find_message(message_to_find)
{
    console.log("finding: "+message_to_find +"...")
    var found=0;
    var type=0;
    for(var i = 0 ; i<messages.length;i++)
    {
        if(messages[i].Message == message_to_find)
        {
            type = messages[i].Type
            found = messages[i].Alert;
            return  [found,type];
        }
        else
        {
            found = "Evento no registrado";
            type = "INFO";
        }
    }
    return  [found,type];
}
function read_csv(callback)
{
    const csvFilePath='messages.csv';
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        console.log(jsonObj);
        messages=JSON.parse(JSON.stringify(jsonObj));
        callback(messages);
    })
}