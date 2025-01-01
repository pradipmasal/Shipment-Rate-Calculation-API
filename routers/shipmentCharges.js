const express = require('express');

const router = express.Router();
const cityBlocks = require('../models/city-blocks')
const rates = require('../models/rates');

//Function for calculate charges
function calculateCharges(baserate, weight, invoiceValue, riskType){
    const baseFreight = Math.max(weight, 40)* baserate;
    const fuelSurcharge = baseFreight * 0.2;
    const dktCharge = 100;
    const fovCharge = invoiceValue * (riskType === 'carrier' ? 0.005 : 0.0005);
    const totalCost = baseFreight + fuelSurcharge + dktCharge + fovCharge;
    return { baseFreight, fuelSurcharge, dktCharge, fovCharge, totalCost };
}

//For calculate the TotalCost for transportation
router.post('/calculate-rate', async (req, res) => {
    const { origin, destination, weight, invoiceValue, riskType } = req.body;
    try {
      // Find the blocks for origin and destination cities
      const originCity = await cityBlocks.findOne({ cities: origin });
      const destinationCity = await cityBlocks.findOne({ cities: destination });

    //   console.log(originCity.block +' '+ destinationCity.block);
      
  
      if (!originCity || !destinationCity) {
        return res.status(404).json({ error: 'Origin or Destination city not found' });
      }
  
      // Fetch the rate between the two blocks
      const rate = await rates.findOne({
        source: originCity.block,
        destination: destinationCity.block
      });
  
      if (!rate) {
        return res.status(404).json({ error: 'Rate for the given blocks not found' });
      }
  
      const charges = calculateCharges(rate.rate, weight, invoiceValue, riskType);
      return res.json(charges);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// For get details of block and cities inside block
router.get('/city-blocks', async(req, res) => {
    try{
        const tabledata = await cityBlocks.find()
        res.json(tabledata) 
    }catch(err){
        res.send(err);
    }
});

// For add details of block and cities inside block
router.post('/add-block',async(req,res)=>{
    const newCity = new cityBlocks({
        block: req.body.block,
        cities: req.body.cities
    })
    try{
        const a1 = await newCity.save()
        res.json(a1)
    }catch(err){
        res.send(err)
    }
});

//For update block and cities inside block
router.patch('/add-city', async(req, res) => {
    const result = await cityBlocks.updateOne(
        {block : req.body.block},
        {$push :{cities : req.body.cities}}
    );
    
    res.json(result);
});

// For get details of rate between blocks for transportation
router.get('/rate', async(req , res)=>{
    try{
        const tabledata = await rates.find();
        res.json(tabledata);
    }catch(err){
        res.send(err);
    }
})

//For add details of rate between blocks for transportation
router.post('/add-rates', async(req, res) =>{
    const input = new rates({
        source: req.body.source,
        destination: req.body.destination,
        rate: req.body.rate
    })
    try{
        const a2= await input.save()
        res.json(a2);
    }catch(err){
        res.send(err);
    }
})

//For update details of rate between blocks for transportation
router.patch('/update-rates', async(req, res) =>{
    const input = await rates.updateOne(
        {source: req.body.source , destination: req.body.destination},
    
        {$set :{rate: req.body.rate}}
    );
    res.json(input);
})


module.exports = router;