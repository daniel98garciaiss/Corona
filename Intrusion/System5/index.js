/* 
 *SECUROS INTEGRATION SERVER - INTRUSION MODULE - SYSTEM5
 *@Authors: 
 *			Alejandra Aguirre  - alejandra.aguirre@issivs.com
 *			Santiago Rondon    - santiago@ivsss.com
 *			Alejandro Garcia   - alejandro@issivs.com
 *Version 1.0 
 *SecurOS 10.9
 *
*/
//Integration using Contact ID

var net = require('net');
const csv = require('csvtojson')
const fs = require('fs');

var messages;

read_csv(function(){
    console.log("Message CSV successfully read");
    process_data();
});

var client = new net.Socket();
client.connect(1027, '192.168.1.175', function() {
    console.log('Connected');
});

client.on('data', function(data) {
    client.write('06'.toString('hex'));
    var data0 = data.toString();
    console.log('Received: ' + data0);
  try
  {
    var pattern = /((\w|\s)*)-*?/ig;
    var data0 = data0.match( pattern );
    console.log("length: "+data0.length,"data 0: "+data0);
    var date = new Date(data0[0]+" "+data0[2]+":"+data0[4]+":"+data0[6]);
    var receptor = data0[14];
    var line = data0[16];
    var abonado = data0[18];
    var message = data0[20];
    var complement = data0[22];
    console.log(date,receptor,line,abonado,message,complement);
    var alarm=find_message(message);
    console.log(alarm)
  } 
  catch(e)
  {
    console.log(e);
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
    for(var i = 0 ; i<messages.length;i++)
    {
        if(messages[i].Message == message_to_find)
        {
            found = messages[i].Alert;
            return  found;
        }
        else
        {
            found = "not found";
        }
    }
    return  found;
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