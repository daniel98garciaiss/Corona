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
const { connect } = require('mongoose');
const router = express.Router();
const user = require('../models/securos')
const passport = require('passport')
const {isAuthenticated, isNotAuthenticated, isAdmin} = require('../helpers/auth')
const relay = require('../models/securos')
const opc = require('../models/opc')

// const securosDriver = require('../drivers/securos')


// setTimeout(securosDriver.start, 30000);

////////////////////////////////////////////////////////////
////////////////////////// VISTAS ///////////////////////////
////////////////////////////////////////////////////////////

/////////////////// VISTA RELAYS //////////////////////
router.get('/relays',isAuthenticated, async (req,res) => {           //ASYNC

    var Relays = await relay.find().lean().sort({name: 'ascending'});

    res.render('relays/relays',{Relays})
});

/////////////////// VISTA CREATE RELAY//////////////////////
router.get('/relays/create',isAuthenticated, async (req,res) => {           
    
    var Opc = await opc.find().lean().sort({name: 'ascending'});
    var methodsArray = [];
    for(let i=0; i<Opc.length; i++) {
        methodsArray.push(Opc[i].methods);
        // console.log(Opc[i].methods)
    }

    res.render('relays/create_relay' , {Opc, methodsArray })
});

/////////////////// VISTA EDIT RELAY//////////////////////
router.get('/relays/edit/:id', isAuthenticated, async (req, res) => {           
    
    const Relay = await relay.findById(req.params.id).lean()
    res.render('relays/edit_relay', {Relay})
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
    
    if(relay_name==''){
        errors.push( {text:'Inserte un nombre para el relay'})
       }
    if(relay_id==''){
        errors.push({text:'Completa todos los campos'})
    }
    if(server_on==''){
        errors.push({text:'Completa todos los campos'})
    }
    if(key_on==''){
        errors.push({text:'Completa todos los campos'})
    }
    if(value_on==''){
        errors.push({text:'Completa todos los campos'})
    }
    if(server_off==''){
        errors.push({text:'Completa todos los campos'})
    }
    if(key_off==''){
        errors.push({text:'Completa todos los campos'})
    }
    if(value_off==''){
        errors.push({text:'Completa todos los campos'})
    }
   
    if(errors.length>0)   
        res.render('create_opc',{errors,name,url})
    else{ 
        const checkopc = await Opc.findOne({url})
        if(checkopc){
            req.flash('error_msg','El servidor OPC ya existe')
            res.redirect('/resources')
        }
        const opc = new Opc({name,url})
        await opc.save();      
        req.flash('success_msg', 'Servidor OPC creado satisfactoriamente!')
        opcDriver.add(opc._id);
        res.redirect('/resources')
    }
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
