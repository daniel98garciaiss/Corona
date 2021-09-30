const Opc = require('../models/opc')
var intervalRealTime = null;

module.exports = 
    function (io){
        let users = {}
        io.on('connection', socket =>{
            console.log("New User Connected")


            socket.on("monitorOpc", id => {
                clearInterval(intervalRealTime);

                // console.log("opc id_______________"+id);
                intervalRealTime = setInterval(async ()=>{
                    try {
                        let opc = await Opc.findOne({"_id": id});
                        // console.log(opc);

                        if(opc.methods){
                            let methods = opc.methods[0];
                            socket.emit("newVariables",{methods});
                        }
                        
                    } catch (error) {
                        console.log(error)
                    }
                  
                }, 100)
            })
        })


        
    }