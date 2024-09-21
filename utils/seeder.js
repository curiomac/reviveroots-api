const theme = require('../data/theme.json');
const Theme = require('../models/themeModel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

dotenv.config({ path: 'config/config.env' });
connectDatabase();

const seedProduct = async () => {
    try {
        await Theme.deleteMany();
        console.log('Products deleted');
        await Theme.insertMany(theme);
        console.log('All products added');
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
};

seedProduct();

// Storage 

await Promise.all(products.map(async (product) => {
    let updated = false;

    product.productImages.forEach(image => {
      if (image.url.includes('http://127.0.0.1:8000')) {
        image.url = image.url.replace('http://127.0.0.1:8000', 'https://reviveroots-api.onrender.com');
        updated = true;
      }
    });

    // Save changes if URLs were updated
    if (updated) {
      await product.save();  // This will save the updated URLs back to the database
    }
  }));