const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config({path:path.join(__dirname,"config/config.env")});

connectDatabase();

// Use the main `app` instance from './app'
app.use(cors());
app.use(bodyParser.json());

const server = app.listen(process.env.PORT,() => {
    console.log(`Server listen to the port: ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('Shutting down the server due to unhandledRejection');
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log('Shutting down the server due to uncaughtException');
    server.close(()=>{
        process.exit(1);
    })
})

//console.log(a);