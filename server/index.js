const {client, connectDB, createTables, createProduct, createUser, fetchUsers, fetchProducts, createFavorite, fetchFavorites, destroyFavorite } = require('./db.js');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

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

  const [favorite1] = await Promise.all([
    createFavorite(alfred.id, Blender.id)
  ]);

  const favorites = await fetchFavorites();
  console.log(`Favorites: `, favorites);

  // destroyFavorite(favorite1.id);

  app.listen(port, () => {
    console.log(`Listening on PORT ${port}`);
    console.log('Curl commands to test:')
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/products`);
    console.log(`curl localhost:${port}/api/favorites`);
    console.log(`curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"username":"Frank","password":"000000"}'`);
    console.log(`curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Laptop"}'`);
    console.log(`curl -X POST http://localhost:3000/api/favorites -H "Content-Type: application/json" -d '{"user_id":"${david.id}","product_id":"${Backpack.id}"}'`);
    console.log(`curl -X DELETE http://localhost:3000/api/favorites/{FAVORITE_ID_HERE}`);
  }) 
}

// GET /api/users route
app.get('/api/users', async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/products route
app.get('/api/products', async (req, res) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/favorites route
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await fetchFavorites();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// POST /api/users route
app.post('/api/users', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    res.status(201).json(user);
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ error: error.message || 'Error creating user' });
  }
});

// POST /api/products route
app.post('/api/products', async (req, res) => {
  const { name } = req.body;
  try {
    const product = await createProduct(name);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// POST /api/favorites route
app.post('/api/favorites', async (req, res) => {
  const { user_id, product_id } = req.body;
  try {
    const favorite = await createFavorite(user_id, product_id);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create favorite' });
  }
});

// DELETE /api/favorites/:id
app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await destroyFavorite(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting favorite' });
  }
});

init();