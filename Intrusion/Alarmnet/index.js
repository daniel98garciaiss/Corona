/* 
 *SECUROS INTEGRATION SERVER - INTRUSION MODULE - ALARMNET
 *@Authors: 
 *			Alejandra Aguirre  - alejandra.aguirre@issivs.com
 *			Santiago Rondon    - santiago@ivsss.com
 *			Alejandro Garcia   - alejandro@issivs.com
 *Version 1.0 
 *SecurOS 10.9
 *
*/

var net = require('net');
const csv = require('csvtojson');
const fs = require('fs');
var request = require('request');

var messages;
var client = new net.Socket();
read_csv(function(){
    console.log("Message CSV successfully read");
    
    client.connect(2000, '127.0.0.1', function() {
    console.log('Connected');
    });
});


client.on('data', function(data) {
    var json;
    var data0 = data.toString().trim();
    console.log('Received: ' + data0);
    if(data0=="00 OKAY @")
    {
      //ACK message
      var buff = Buffer.from([6]);
      client.write(buff);
      console.log("ACK send")
    }
    else
    {
      var data1 = data0.split(" ");
      console.log(data1);
      switch(data1.length)
      {
        case 5:
        //Ademco High Speed
            var receiver = data1[0];
            var acount = data1[1];
            var message1 = data1[2];
            var message2 = data1[3];
            var status = data[4];
            var[event,type] = find_message(message1.toString()+message2.toString());
            console.log(event,type);
            if(event==undefined)
                event="Evento no registrado";
            if(type==undefined)
                type="INFO";

            json = {
                "receiver": receiver,
                "panel": acount,
                "event_code":message1+message2,
                "comment":event,
                "event":type,
                "status":status
            };

            console.log(json);
            var options = {
            'method': 'POST',
            'url': 'http://127.0.0.1:3007/api/securos/event',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json) //JSON.stringify({"receiver":"1","panel":"1752","cid":"18","event_code":"E401","comment":"not found","event":"ALARM","partition":"49","sensor":"1","type":"SENSOR","typeID":"1"})

            };
            var buff = Buffer.from([6]);
            client.write(buff);
            console.log("ACK send")
        break;
        case 6:
        //Contact ID
            var receiver = data1[0];
            var acount = data1[1];
            var cid = data1[2];
            var event_code = data1[3];
            var partition = data[4];
            var contact = data1[5];

            var [event,type] = find_message(event_code.toString());
            console.log(event,type);
            if(event==undefined)
                event="Evento no registrado";
            if(type==undefined)
                type="INFO";

            json = {
                "receiver":receiver,
                "panel":acount,
                "cid":cid,
                "event_code":event_code,
                "comment":event,
                "event":type,
                "partition":partition,
                "sensor":contact
            }
            console.log(json);
            var options = {
            'method': 'POST',
            'url': 'http://127.0.0.1:3007/api/securos/event',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json) //JSON.stringify({"receiver":"1","panel":"1752","cid":"18","event_code":"E401","comment":"not found","event":"ALARM","partition":"49","sensor":"1","type":"SENSOR","typeID":"1"})

            };
            var buff = Buffer.from([6]);
            client.write(buff);
            console.log("ACK send")
        break;
        default:
            console.log("default case");
            var buff = Buffer.from([21]);
            client.write(buff);
            console.log("NAK send")
        break;
    }
    request(options, function(error, response) {
        if (error) throw new Error(error);
            console.log(response.body);
    });
    
    }  
    //client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});

/*read_csv(function(){
    var find=find_message("E105");
    console.log(find)
});*/

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
            found = "not found";
            type = "ALARM";
        }
    }
    return  [found,type];
}

function process_data(data)
{
       var data0 = "29 Jul 2021-10:33:14-01/C1-SG -01-000-0000-NVZ0100-TCP/IP 1 Printer Failed";
    console.log('Received: ' + data0);
  try
  {
    var pattern = /((\w|\s)*)-*?/ig;
    var data0 = data0.match( pattern );
    console.log("length: "+data0.length,"data 0: "+data0);
    var date = new Date(data0[0]+" "+data0[2]+":"+data0[4]+":"+data0[6]);
    var receptor = data0[14];
    var line = data0[16];
    var panel = data0[18];
    var message = data0[20];
    var complement = data0[22];
    console.log(date,receptor,line,panel,message,complement);
    var alarm=find_message(message);
    console.log(alarm)
  } 
  catch(e)
  {
    console.log(e);
  }
}

var status = ["Diagnostic",
"Notification",
"N/A",
"N/A",
"N/A",
"Suscriber trouble",
"Status",
"Alarm",
"Alarm with low battery",
"Test"
];