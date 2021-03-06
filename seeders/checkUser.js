const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
//connect mongoose
(async function seedDb() {
	try {
		await mongoose.connect('mongodb+srv://admin-calum:QPE9xzsiYfExnWy4@sutygon.aqp0q.mongodb.net/main?retryWrites=true&w=majority', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
    console.log('Database connected');
    const data = await User.findOneAndDelete({email:'zohaibalishah1997@gmail.com'})
    console.log(data)
		// await Product.deleteMany({ createdBy: '603fe94645175b0015d3ce1c' });

	} catch (error) {
		process.exit(1);
	}
})();
