import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker/locale/en';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('testing always fresh', () => {
  let newCookieName 
  let newCookieValue 
  describe('testing sessions', () => {
    let cookieName;
    let cookieValue;
    let userId;
    const mockUser = {
      firstName: 'Maximo',
      lastName: 'Lorenzo',
      age: 25,
      email: faker.internet.email(),
      password: '1234',
      cart: '6508c23cb1a0998f034e3cd3',
    };
    it('POST : /api/sessions/register, should register a user and redirect to the products page', async () => {
      const { status } = await requester.post('/api/sessions/register').send(mockUser);
      expect(status).to.be.equal(302);
    });
    it('POST : /api/sessions/login, should register a user and return a cookie', async () => {
      const result = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      });

      const cookie = result.headers['set-cookie'][0];
      expect(cookie).to.be.ok;

      cookieName = cookie.split('=')[0];
      cookieValue = cookie.split('=')[1];

      expect(cookieName).to.be.ok.and.eql('connect.sid');
      expect(cookieValue).to.be.ok;
    });
    it("GET : /api/sessions/current, Send cookie to see the user's content.", async () => {
      const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieName}=${cookieValue}`]);
      expect(_body.payload.email).to.be.eql(mockUser.email);
      userId = _body.payload._id;
    });
    it('POST : /api/users/premium/:uid, should change the user role to premium', async () => {
      const send = await requester.post(`/api/users/premium/${userId}`);
      const { text, status } = send;
      expect(status).to.be.eql(200);
      const successMessageRegex = /your role was changed successfully , role : premium/;
      const successMessageFound = successMessageRegex.test(text);
      expect(successMessageFound).to.be.true;
      const newCookieValue = 'cookie_con_rol_premium';
      cookieName = newCookieValue
    });
    it('POST : /api/sessions/login, new login with changed role', async () => {
      const result = await requester.post('/api/sessions/login').send({
        email: mockUser.email,
        password: mockUser.password,
      });
    
      const newCookie = result.headers['set-cookie'][0];
      expect(newCookie).to.be.ok;
    
      newCookieName  = newCookie.split('=')[0];
      newCookieValue = newCookie.split('=')[1];
    
      expect(newCookieName).to.be.ok.and.eql('connect.sid');
      expect(newCookieValue).to.be.ok;
    });
  });
  describe('testing products', () => {
    let productMock
    
    it('GET : /api/products, should show me all the products in the database', async () => {
      const response = await requester.get('/api/products').set('Cookie', [`${newCookieName}=${newCookieValue}`]);
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.be.an('array');
      expect(_body.payload.length).to.be.above(0);
    });
    it('POST : /api/products, should create a product correctly', async () => {
      productMock = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.number.int(1000),
        price: faker.commerce.price(),
        stock: faker.number.int(100),
        category: faker.commerce.department(),
        thumbnail: faker.image.url(),
      };
      const response = await requester.post('/api/products').send(productMock).set('Cookie', [`${newCookieName}=${newCookieValue}`]);
      const { status, ok, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.have.property('_id');
      productMock._id = _body.payload._id
    });
    it('DELETE : /api/products/:_id, should create a product correctly', async () => {
      const response = await requester.delete(`/api/products/${productMock._id}`).set('Cookie', [`${newCookieName}=${newCookieValue}`]);
      const { status, text } = response;
      expect(status).to.equal(200);
      const successMessageRegex = /product deleted/;
      const successMessageFound = successMessageRegex.test(text);
      expect(successMessageFound).to.be.true;
    });
  });
  describe('testing carts', () => {
    let cartId
    it('GET : /api/carts, should show me all the carts in the database', async () => {
      const response = await requester.get('/api/carts');
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.payload).to.be.an('array');
      expect(_body.payload.length).to.be.above(0);
    });
    it('POST : /api/carts, should create a new cart with an id', async () => {
      const response = await requester.post('/api/carts');
      const { status, _body } = response;
      expect(status).to.equal(201);
      expect(_body.payload).to.be.an('object');
      expect(_body.payload).to.have.property('_id');
      expect(_body.payload._id).to.exist;
      cartId = _body.payload._id
    });
    it('DELETE : /api/carts/:cid, should empty the cart of the id that you pass as a parameter', async () => {
      const response = await requester.delete(`/api/carts/${cartId}`);
      const { status, _body } = response;
      expect(status).to.equal(200);
      expect(_body.message).to.exist;
      expect(_body.message).to.be.equal('the cart has been cleared');
    });
  });
});
