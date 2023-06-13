import { ProdModel } from "../DAO/models/product.model.js";

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
      }
    );
    return products;
  }
  async addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  }) {
    const productAdded = await ProdModel.create({
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnail,
    });
    return productAdded;
  }
  async updateProduct(_id, updaProd) {
    const result = await ProdModel.updateOne({ _id: _id }, { $set: updaProd });

    if (result.nModified === 0) {
      return null;
    }

    return updaProd;
  }
  async deleteOne(_id) {
    const deleted = await ProdModel.deleteOne({ _id: _id });
    return deleted;
  }
  async getProductById(_id) {
    const productById = await ProdModel.findOne({ _id: _id });
    return productById;
  }
  async getAllViews() {
    const products = await ProdModel.find({}, {
      _id: 1,
      thumbnail: 1,
      title: 1,
      description: 1,
      code: 1,
      stock: 1,
      category: 1,
      price: 1,
      status:1
    }).lean();
    return products;
  }
}

export const productService = new ProductService();
