const Opc = require('../models/opc')
var intervalRealTime = null;

const {querySecuros, queryDispatch} = require('../public/js/pg');

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
                  
                }, 300)
            })


            socket.on("updatePriority", async (id, priority) => {
                console.log(id, priority)
                try {
                    // let done = await querySecuros(`INSERT INTO "OBJ_SENSOR" (id, tp_name) VALUES (${id}, '${priority}')
                    //                                 ON CONFLICT(id)
                    //                                 DO UPDATE SET NAME = '${priority}'`);
                                                    
                    let done = await querySecuros(`UPDATE "OBJ_SENSOR" SET tp_name = '${priority}' WHERE id = '${id}'`);
                    console.log("priority updated");    
                } catch (error) {
                }
            })
        })


        
    }