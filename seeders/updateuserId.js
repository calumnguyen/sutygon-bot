const mongoose = require('mongoose');
const Coupons = require('../models/Coupons');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const RentedProducts = require('../models/RentedProducts');
const User = require('../models/User');
const Appointments = require('../models/Appointments');
const Events = require('../models/Events');
//connect mongoose
(async function seedDb() {
	try {
		await mongoose.connect('mongodb+srv://admin-calum:QPE9xzsiYfExnWy4@sutygon.aqp0q.mongodb.net/main?retryWrites=true&w=majority', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Database connected');
		// 5fd68cf371efe200175d9ce0
		await Coupons.updateMany({}, { createdBy: '5fd68cf371efe200175d9ce0' });
		await Product.updateMany({}, { createdBy: '5fd68cf371efe200175d9ce0' });
		await Customer.updateMany({}, { createdBy: '5fd68cf371efe200175d9ce0' });
		await RentedProducts.updateMany(
			{},
			{ createdBy: '5fd68cf371efe200175d9ce0' }
		);
		await User.updateMany({}, { createdBy: '5fd68cf371efe200175d9ce0' });
		await Appointments.updateMany(
			{},
			{ createdBy: '5fd68cf371efe200175d9ce0' }
		);
		await Events.updateMany(
			{},
			{ createdBy: '5fd68cf371efe200175d9ce0', removed: false }
		);

		console.log('Update RentedProducts Documents');
	} catch (error) {
		process.exit(1);
	}
})();
