import { ProdModel } from "../DAO/models/product.model";

class ProductService {
  async getAll() {
    const products = await ProdModel.find(
      {},
      {
        title: true,
        description: true,
        code: true,
        price: true,
        stock: true,
        category: true,
        thumbnail: true,
        status: true,
      }
    );
    return products;
  }
}

export const productService = new ProductService();
