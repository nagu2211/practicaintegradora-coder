import { faker } from "@faker-js/faker/locale/en";


export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int(100),
    price: faker.commerce.price({ symbol: '$',dec:0 }),
    category: faker.commerce.department(),
    thumbnail: faker.image.url(),
  };
};
