const express = require('express');
const mongoose = require('mongoose');
const url = 'mongodb+srv://masalpradip04:nkHSuq2L1MqtRErh@cluster0.uwbp1.mongodb.net/shipmentCharges?retryWrites=true&w=majority&appName=Cluster0';

const app = express()

mongoose.connect(url)
    .then(() => {
        console.log("Connected to db...")
    })
    .catch(err => {
        console.log(err);
    });

app.use(express.json());

const shipmentChargesRouter = require('./routers/shipmentCharges');
app.use('/shipmentCharges', shipmentChargesRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
