const express = require ('express');
const dbConnect = require('./config/dbConnect');
const authRouter = require ('./routes/authRoutes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const productRouter = require ('./routes/productRoute');
const blogRouter = require ('./routes/blogRoutes');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8800;
const cookieParser = require ('cookie-parser')
const morgan = require ('morgan')
dbConnect();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())



app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
});