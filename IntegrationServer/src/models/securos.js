const mongoose = require('mongoose');
const {Schema} = mongoose;

const SecurOSSchema = new Schema({
    name: { type:String, required:true},
    type: { type:String, required:true},
    id:{ type:String, required:false, "default" : 'Desconectado'},
    actions: { type:Array, "default" : [] }
})

module.exports = mongoose.model('Opc',SecurOSSchema)

