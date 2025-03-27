const {client, connectDB, createTables, createProduct, createUser, fetchUsers, fetchProducts, createFavorite, fetchFavorites } = require('./db.js');

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

const init = async () => {
  await connectDB();
  await createTables();

  const [alfred, brandon, charlie, david, eric, Blender, Watch, Headphones, Backpack, Desk] = await Promise.all([
    createUser('alfred', '123456'),
    createUser('brandon', '234567'),
    createUser('charlie', '345678'),
    createUser('david', '456789'),
    createUser('eric', '567890'),
    createProduct('Blender'),
    createProduct('Watch'),
    createProduct('Headphones'),
    createProduct('Backpack'),
    createProduct('Desk'),
  ]);
  const users = await fetchUsers();
  console.log('Users: ', users);

  const products = await fetchProducts();
  console.log('Products: ', products);

  const favories = await Promise.all([
    createFavorite(
      alfred.id,
      Blender.id
    )
  ]);

  const favorites = await fetchFavorites();
  console.log(`Favorites: `, favorites);

  app.listen(port, () => console.log(`listening on port ${port}`))
}

init();