const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const Products = require('../models/product.model');

require('dotenv').config();

jest.setTimeout(30000); // increase timeout to 30 seconds

describe('API endpoints', () => {
  let Product;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Products.deleteMany();

    // Create a new product
    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Product 1',
        price: 1009,
        description: 'Description 1',
      });
    Product = res.body;
    console.log(Product)
  });

  describe('POST /api/products', () => {
    it('should create a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Product 2',
          price: 2010,
          description: 'Description 2',
        });
      const newProduct = res.body;
      expect(res.status).toBe(201);
      expect(newProduct.name).toBe('Product 2');
    });
  });

  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product', async () => {
      const res = await request(app).get(`/api/products/${Product._id}`);
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Product 1');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const res = await request(app)
        .patch(`/api/products/${Product._id}`)
        .send({
          name: 'Product 4',
          price: 104,
          description: 'Description 4',
        });
      expect(res.status).toBe(200);
      expect(res.body.price).toBe(104);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const res = await request(app).delete(`/api/products/${Product._id}`);
      expect(res.status).toBe(200);
    });
  });
});
