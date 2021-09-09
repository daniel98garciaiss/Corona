const mongoose = require('mongoose');

const uri = "mongodb+srv://alejo:alejo@cluster0.8ihms.mongodb.net/iss?retryWrites=true&w=majority";
// const uri = "mongodb+srv://db_user_integretion_server:1234567890@cluster0.6vwhm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";


console.log("Connecting to mongodb...")
mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser:true,
    useFindAndModify: false
}).then (db => console.log("conectado a mongoBD"))
  .catch(err => console.error(err))



