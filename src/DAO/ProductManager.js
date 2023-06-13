import { promises as fs } from "fs";
import { nanoid } from "nanoid";

export default class productManager {
  constructor() {
    this.products = [];
    this.path = "./products.json";
  }
  readProducts = async () => {
  let pStrings = await fs.readFile(this.path, "utf-8");
  let parse = JSON.parse(pStrings);
  return parse;
};
  addProduct = async ({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  }) => {
    let productsParse = await this.readProducts();
    let addedProduct = {
      id: nanoid(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnail,
    };
    this.products = [...productsParse, addedProduct];
    await fs.writeFile(this.path, JSON.stringify(this.products));
  };
  getProductById = async (id) => {
    let productsParse2 = await this.readProducts();
    return productsParse2.filter((prod) => prod.id === id);
  };

  deleteProduct = async (id) => {
    let productsParse3 = await this.readProducts();
    let productFilter = productsParse3.filter((products) => products.id != id);
    await fs.writeFile(this.path, JSON.stringify(productFilter));
    return `the product with the id: ${id} has been removed`;
  };
  updateProduct = async (id, updaProd) => {
    let productsParse4 = await this.readProducts();
  
    const indice = productsParse4.findIndex(ind => ind.id === id);
  
    if (indice === -1) {
      return null; // Elemento no encontrado
    }
  
    // Crear una copia del elemento encontrado
    const elementoActualizado = { ...productsParse4[indice] };
  
    // Actualizar solo las propiedades especificadas
    Object.assign(elementoActualizado, updaProd);
  
    productsParse4[indice] = elementoActualizado;
  
    await fs.writeFile(this.path, JSON.stringify(productsParse4, null));
  
    return elementoActualizado;
  };
}
