const { Client } = require('pg');

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const client = new Client(
  process.env.DATABASE_URL || 
  'postgres://megan.chiu:password@localhost:5432/the_acme_store_db'
);

const connectDB = async () => {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected to database.');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createTables = async () => {
  const SQL = `
      DROP TABLE IF EXISTS favorites, users, products CASCADE;

      CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255)
      );

      CREATE TABLE products(
          id UUID PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
        CONSTRAINT unique_product_user UNIQUE (product_id, user_id)
      );
  `;

  try {
    await client.query(SQL);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

const createProduct = async (name) => {
  try {
    const id = uuidv4();
    const SQL = `INSERT INTO products (id, name) VALUES ($1, $2) RETURNING *;`;
    const { rows } = await client.query(SQL, [id, name]);
    return rows[0];
  } catch (error) {
    console.error('Error creating product:', error);
  }
};

const createUser = async (username, password) => {
  try {
    const id = uuidv4();
    const SQL = `
      INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [id, username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
}

const fetchProducts = async()=> {
  const SQL = `
    SELECT * FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
}

module.exports = {
  client,
  connectDB,
  createTables,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts
};