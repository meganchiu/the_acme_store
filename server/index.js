const {client, connectDB, createTables, createProduct, createUser } = require('./db.js');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const init = async () => {
  await connectDB();
  await createTables();

  const [alfred, brandon, charlie, david, eric] = await Promise.all([
    createUser('alfred', '123456'),
    createUser('brandon', '234567'),
    createUser('charlie', '345678'),
    createUser('david', '456789'),
    createUser('eric', '567890'),
    createProduct('EcoSmart Blender'),
    createProduct('Solar Powered Watch'),
    createProduct('Premium Wireless Headphones'),
    createProduct('Vintage Leather Backpack'),
    createProduct('Adjustable Standing Desk'),
    
  ]);
  app.listen(port, () => console.log(`listening on port ${port}`))
}

init();