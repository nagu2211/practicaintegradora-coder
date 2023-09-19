import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker/locale/en';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('testing always fresh', () => {
  describe('testing sessions', () => {
    let cookieName;
    let cookieValue;
    const mockUser = {
      first_name: 'Maximo',
      last_name: 'Lorenzo',
      age:25,
      email: faker.internet.email(),
      password: '1234',
      cart: "6508c23cb1a0998f034e3cd3"
    };
    it('Debe registrar un usuario', async () => {
      const { _body,status } = await requester.post('/api/sessions/register').send(mockUser);
      expect(status).to.be.equal(200);
    });

    it('Debe loggear un user y DEVOLVER UNA COOKIE', async () => {
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

    it('Enviar cookie para ver el contenido del user', async () => {
      // console.log(cookieName,cookieValue)
      const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookieName}=${cookieValue}`]);
      console.log(_body)
      // expect(_body.payload.email).to.be.eql(mockUser.email);
    });
  });
  // describe('testing products', () => {
  //   it('POST : /api/products, should create a product correctly', async () => {
  //     const productMock = {
  //       title: faker.commerce.productName(),
  //       description: faker.commerce.productDescription(),
  //       code: faker.number.int(1000),
  //       price: faker.commerce.price(),
  //       stock: faker.number.int(100),
  //       category: faker.commerce.department(),
  //       thumbnail: faker.image.url(),
  //     };
  //     const response = await requester.post('/api/products').send(productMock);
  //     const { status, ok, _body } = response;
  //     expect(status).to.equal(201);
  //     expect(_body.payload).to.have.property('_id');
  //   });
  // });
  // describe('testing carts', () => {});
});
