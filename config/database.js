const mongoose = require('mongoose');
const { DBCONNECTION } = require('../utils/appConstants');
const connectDatabase = ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME
    }).then(con=>{
        console.log(DBCONNECTION.SUCCESSFUL)
    })
}
module.exports=connectDatabase;