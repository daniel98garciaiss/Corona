const express = require('express');
const { connect } = require('mongoose');
const router = express.Router();
const passport = require('passport')

//resources Models
const user = require('../../models/user')
const restapi = require('../../models/restapi')
const opc = require('../../models/opc')


const {isAuthenticated, isAdmin} = require('../../helpers/auth')


router.get('/resources',isAuthenticated, async (req,res) => {           //ASYNC
    var Opc = await opc.find().lean().sort({name: 'ascending'});
    var Restapi = await restapi.find().lean().sort({name: 'ascending'});
    res.render('resources',{Opc,Restapi})
    
});

module.exports = router;