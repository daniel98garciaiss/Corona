/* 
 *SECUROS INTEGRATION SERVER - USER ROUTES MODULE
 *@Authors: 
 *			Alejandra Aguirre  - alejandra.aguirre@issivs.com
 *			Santiago Rondon    - santiago@ivsss.com
 *			Alejandro Garcia   - alejandro@issivs.com
 *          Daniel Garcia      - daniel.garcia@issivs.com
 *Version 1.0 
 *SecurOS 10.9
 *
*/ 
const express = require('express');
const router = express.Router();
const securosDriver = require('../drivers/securos');
const {isAuthenticated, isNotAuthenticated, isAdmin} = require('../helpers/auth')
const relay = require('../models/securos');
const opc = require('../models/opc');
const opcDriver = require('../drivers/opc')

const {querySecuros, queryDispatch} = require('../public/js/pg');

setTimeout(securosDriver.start, 30000);

////////////////////////////////////////////////////////////
////////////////////////// VISTAS //////////////////////////
////////////////////////////////////////////////////////////

////////////////////// VISTA RELAYS ////////////////////////
router.get('/sensors',isAuthenticated, async (req,res) => { 
    
    let sensors_wanted_to_show = 30;


    //pagina por defecto
    let page = 1;

    if(req.query.page){
        page = req.query.page
    }          //ASYNC
   
    //obtenemos todos los sensor de securos
    let array_sensors = await querySecuros(`SELECT * FROM "OBJ_GENERIC_SENSOR" 
                                            LIMIT ${sensors_wanted_to_show} OFFSET  (${page} - 1) * ${sensors_wanted_to_show}`);
    // console.log(array_sensors);

    //buscamos en el dispatch sensor por sensor a ver si exite
    //si existe lo almacenamos la prioridad en un array (priority_array)
    //si no existe almacenamos una prioridad " "
    //luego lo pasamos a la vista
    let array_priority = [];
    for (let i = 0; i < array_sensors.length; i++) {
        const sensor_id = array_sensors[i].id;
        // console.log(sensor_id);

        let data = await queryDispatch(`SELECT * FROM "PRIORITY" WHERE id = ${sensor_id}`);

        // console.log(data);
            if(data.length > 0){
                array_sensors[i].priority =  data[0].name;
            }else{
                array_sensors[i].priority =  " ";
            }
    }
    // console.log(array_priority)

    //-------------------------------paginacion------------------------------- 
    let sensors_quantiy = await querySecuros(`SELECT COUNT(*) FROM "OBJ_GENERIC_SENSOR"`);
    // console.log(sensors_quantiy)
    let array_paginator_pages = [];
    for (let i = 0; i < sensors_quantiy[0].count/sensors_wanted_to_show; i++) {
        array_paginator_pages[i]  = i+1;
    }
    // console.log(array_paginator_pages);
    res.render('sensors',{array_sensors, array_paginator_pages, page});
});


////////////////////////////////////////////////////////////
///////////////////////// METODOS //////////////////////////
////////////////////////////////////////////////////////////

/////////////////// METODO EDIT RELAY//////////////////////
// router.put('/relay/edit/:id',isAuthenticated, async (req, res) => {           
    
//     let obj_sensors;
//     pg.querySecuros(`SELECT * FROM OBJ_GENERIC_SENSOR ORDER BY id ASC`, function(res)
//     {    
//         console.log(res);
//     });

    // res.redirect('/sensors')
// });

module.exports = router;
