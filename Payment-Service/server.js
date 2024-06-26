const express = require('express')
const mongoose = require('mongoose')

const morgan = require('morgan')
const helmet = require('helmet')
const paymentRoutes = require('./Routes/paymentRoutes')

const { collectMetrics, metricsEndpoint } = require('./Middleware/metrics');
require('dotenv').config()
const logger = require('./Logger/logger')
const app = express()
app.use(express.json())

app.use(collectMetrics); 
app.use(helmet())
app.use(morgan('dev'))

app.use((req, res, next) => {
    //console.log(req.path, req.method)
    logger.info(req.path, req.method)
    next()
})

app.use('/api/payment', paymentRoutes)

app.get('/metrics', metricsEndpoint);

mongoose.connect(process.env.MONG_URI)
    .then(() => {
        app.listen((process.env.PORT), () => {
            console.log('Connected to DB and listening to port', process.env.PORT)
            logger.info('Connected to DB and listening to port: 5000')
        })
    })
    .catch((error) => {
        console.log(error)
    })