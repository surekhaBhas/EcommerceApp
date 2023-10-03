const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const cors=require('cors')
const PORT =  8500;

dotenv.config();

connectDB(); 

app.use(cors())
app.use(express.json());
app.use(morgan('dev'));


app.use((req, res, next) => {
  console.log('Received request:', req.url);
  console.log('Request body:', req.body);
  next();
});

//Routes
app.use('/auth', require('./routes/authRoute'));
app.use('/category',require('./routes/categoryRoutes'))
app.use('/product',require('./routes/productRoutes'))


app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
