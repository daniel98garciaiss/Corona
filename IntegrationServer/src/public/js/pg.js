const {Pool, Client} = require('pg');

//securos
const poolSecuros = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'securos',
    password: 'postgres',
    port: 5432,
});

//dispatch
const poolDispatch = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dispatch',
    password: 'postgres',
    port: 5432,
});

const querySecuros = async (q) => {
    try {
        const response = await poolSecuros.query(q);
        return response.rows;
    } catch (error) {
        
    }
}

const queryDispatch = async (q) => {
    try {
        const response = await poolDispatch.query(q);
        return response.rows;
    } catch (error) {
            
    }
}

// exports.querySecuros =  function querySecuros(q, callback){
//      poolSecuros.query(q,  (err, res) => {
// 		      	if (err) {
// 		    		console.error(err.stack);
// 		    		//callback(err);
// 		  		} else {
// 		    		 callback(res);
// 		  		}  
//     });
// }

// exports.queryDispatch =  function queryDispatch(q, callback){
//      poolDispatch.query(q,  (err, res) => {
// 		      	if (err) {
// 		    		console.error(err.stack);
// 		    		//callback(err);
// 		  		} else {
// 		    		 callback(res);
// 		  		}  
//     });
// }

module.exports = {
    querySecuros,
    queryDispatch
}
