const mongoose = require ("mongoose")
require("dotenv").config()

const dbConnection = ()=>{
    mongoose.connect(process.env.DB_URL).then((conn)=>{
    console.log(`Database Connected : ${conn.connection.host}`);
})
}

module.exports = dbConnection;