/* 
 *SECUROS INTEGRATION SERVER - USER ROUTES MODULE
 *@Authors: 
 *			Alejandra Aguirre  - alejandra.aguirre@issivs.com
 *			Santiago Rondon    - santiago@ivsss.com
 *			Alejandro Garcia   - alejandro@issivs.com
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

// const securosDriver = require('../drivers/securos')


// setTimeout(securosDriver.start, 30000);

////////////////////////////////////////////////////////////
////////////////////////// VISTAS ///////////////////////////
////////////////////////////////////////////////////////////

/////////////////// VISTA RELAYS //////////////////////
router.get('/relays',isAuthenticated, async (req,res) => {           //ASYNC

    var Relays = await relay.find().lean().sort({name: 'ascending'});

    res.render('relays/relays',{Relays});
});

/////////////////// VISTA CREATE RELAY//////////////////////
router.get('/relays/create',isAuthenticated, async (req,res) => {           
    
    var Opc = await opc.find().lean().sort({name: 'ascending'});

    // var methodsArray = [];
    // for(let i=0; i<Opc.length; i++) {
        // methodsArray.push(Opc[i].methods);
        // console.log(Opc[i].methods)
    // }

    res.render('relays/create_relay' , {Opc});
});

/////////////////// VISTA EDIT RELAY//////////////////////
router.get('/relays/edit/:id', isAuthenticated, async (req, res) => {           
    
    const Relay = await relay.findById(req.params.id).lean();
    res.render('relays/edit_relay', {Relay});
});

////////////////////////////////////////////////////////////
//////////////////////////METODOS ///////////////////////////
////////////////////////////////////////////////////////////

/////////////////// METODO CREATE RELAY//////////////////////

router.post('/relays/create',isAuthenticated, async (req,res) => {     

    const {
        relay_name, 
        relay_id, 

        server_on,
        key_on,
        value_on,

        server_off,
        key_off,
        value_off} = req.body;

    const errors = []
    // console.log(req.body);

    if(!relay_name || !relay_id || !server_on || !key_on || !server_off || !key_off){
        errors.push({text:'Complete todos los campos'})
    }else if(value_on == '' || value_off == ''){
        errors.push({text:'Complete todos los campos'})
    }
    
   
    if(errors.length>0){
        res.render('relays/relays',{errors})
    }
            const checkRelay_id = await relay.findOne({typeID: relay_id }).lean();
            // const loginUser = await user.findOne({login:login})
            
            if(checkRelay_id.typeID){
                req.flash('error_msg','Ya existe un Relay con este Id')
                res.redirect('/relays')
            }

            //Creating the struct
            const relayObj = {
                'name': relay_name,
                'type':'GENERIC_RELAY',
                'typeID': relay_id,
                'actions':{
                    'ON':{
                        'server': server_on,
                        'key': key_on,
                        'value': value_on
                    },
                    'OFF':{
                        'server': server_off,
                        'key': key_off,
                        'value': value_off
                        }
                }
            }

            const Relay = new relay(relayObj)
            await Relay.save();      
            req.flash('success_msg', 'Relay creado satisfactoriamente!')
            // securosDriver.add(relay._id);
            res.redirect('/relays')
        
});


/////////////////// METODO EDIT RELAY//////////////////////
router.put('/relay/edit/:id',isAuthenticated, async (req, res) => {           
    
    var {name,type,typeID} = req.body;
   
        await relay.findByIdAndUpdate(req.params.id,{name,type,typeID});
        req.flash('success_msg', 'Relay editado satisfactoriamente!')
        res.redirect('/relays')
});


/////////////////// METODO DELETE RELAY//////////////////////
router.delete('/relays/delete/:id',isAuthenticated, async (req,res) => {           
    await relay.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Relay eliminado satisfactoriamente!')
    res.redirect('/relays')
});
module.exports = router;
