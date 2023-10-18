import { ProdModelMongoose } from "./models/product.model.mongoose.js";

class ProductModel {
    async getAllProducts() {
        const products = await ProdModelMongoose.find(
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
      async paginate(querypage) {
        const queryResult = await ProdModelMongoose.paginate(
            {},
            { limit: 6, page: querypage || 1 }
          );
          return queryResult
      }
      async paginatePersonalized(filter,options) {
        const paginateResult = await ProdModelMongoose.paginate(filter, options);
        return paginateResult;
      }
      async findByCode(code) {
        const findOne = await ProdModelMongoose.findOne({ code: code });
        return findOne
      }
      async createProduct(productDTO) {
        const productAdded = await ProdModelMongoose.create(productDTO);
          return productAdded;
      }
      async create(newProd){
        const create = await ProdModelMongoose.create(newProd);
        return create
      }
      async findOneProduct(_id) {
        const existingProduct = await ProdModelMongoose.findOne({ _id: _id });
        return existingProduct
      }
      async findOneProductView(pid) {
        const existingProduct = await ProdModelMongoose.findOne({ _id: pid }).lean();
        return existingProduct
      }
      async update(_id,updaProd){
        const result = await ProdModelMongoose.updateOne(
            { _id: _id },
            { $set: updaProd }
          );
          return result
      }
      async delete(_id){
        const deleted = await ProdModelMongoose.deleteOne({ _id: _id });
        return deleted;
      }
}

export const productModel = new ProductModel();
