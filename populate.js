const dotenv=require('dotenv')
const connectDB = require('./db/connect')
const Product = require('./models/product')

const jsonProducts = require('./products.json')

dotenv.config({path:'config.env'})

const start = async () => {
  try {
    connectDB();
    await Product.deleteMany()
    await Product.create(jsonProducts)
    console.log('Success!!!!')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
