const mongoose = require('mongoose');
const Coupons = require('../models/Coupons');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const RentedProducts = require('../models/RentedProducts');
const User = require('../models/User');
const Appointments = require('../models/Appointments');
const Events = require('../models/Events');
const Store =require("../models/Store");
//connect mongoose
(async function seedDb() {
	try {
		await mongoose.connect(
			'mongodb+srv://admin-calum:QPE9xzsiYfExnWy4@sutygon.aqp0q.mongodb.net/main?retryWrites=true&w=majority',
			// 'mongodb://localhost:27017/sutygon',
			
			{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Database connected');
		// 5fd68cf371efe200175d9ce0 user
		// 6054e99aa105ee290818e45b live store

		// const res=await Store.find({});
		// console.log(res)
		await Coupons.updateMany({}, { createdBy: '6054e99aa105ee290818e45b' });
		await Product.updateMany({}, { createdBy: '6054e99aa105ee290818e45b' });
		await Customer.updateMany({}, { createdBy: '6054e99aa105ee290818e45b' });
		await RentedProducts.updateMany(
			{},
			{ createdBy: '6054e99aa105ee290818e45b' }
		);
		await User.updateMany({}, { createdBy: '6054e99aa105ee290818e45b' });
		await Appointments.updateMany(
			{},
			{ createdBy: '6054e99aa105ee290818e45b' }
		);
		await Events.updateMany(
			{},
			{ createdBy: '6054e99aa105ee290818e45b', removed: false }
		);

		console.log('Update All Documents');
	} catch (error) {
		process.exit(1);
	}
})();
