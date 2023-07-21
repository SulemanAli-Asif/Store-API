require('express-async-errors');
const dotenv=require ('dotenv');
const express=require('express');
const app=express();
const notFoundMiddleware=require('./middleware/not-found');
const errorHandlerMiddleware=require('./middleware/error-handler');
const connectDB = require('./db/connect');
const productRouter=require('./routes/products')

dotenv.config({path:'config.env'})
// connecting to the database
connectDB();

//middleware
app.use(express.json())

//routes
app.get('/',(req,res)=>{
    res.send('<h1> Store API </h1> <a href="/api/v1/products">Products Route</a>')
})

app.use('/api/v1/products',productRouter)

// products route

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const PORT=process.env.PORT||5000;


app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`)
})
