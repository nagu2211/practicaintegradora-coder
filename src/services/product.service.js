import { productModel } from "../DAO/mongo/product.model.js";
// import { productModel } from "../DAO/memory/product.memory.js";


class ProductService {
  async getAll() {
    const products = await productModel.getAllProducts();
    return products;
  }
  async getAllViews(querypage) {
    const queryResult = await productModel.paginate(querypage);
    
    const {
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    } = queryResult;
    let prodsPaginated = queryResult.docs;
   
    prodsPaginated = prodsPaginated.map((prod) => {
      return {
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        code: prod.code,
        price: prod.price,
        stock: prod.stock,
        category: prod.category,
        thumbnail: prod.thumbnail,
        status: prod.status,
      };
    });
    
    return ({
      
      prodsPaginated,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    })
    }

  async addProduct(productDTO) {
    const originalProduct = await productModel.findByCode(productDTO.code);
    if (originalProduct) {
      return false;
    } else {
      const productAdded = await productModel.createProduct(productDTO);
      return productAdded;
    }
  }
  async updateProduct(_id, updaProd) {
    const existingProduct = await productModel.findOneProduct( _id );
    if (existingProduct) {
      const result = await productModel.update(_id, updaProd);

      if (result.nModified === 0) {
        return null;
      }

      return updaProd;
    } else {
      return false;
    }
  }
  async deleteOne(_id) {
    const deleted = await productModel.delete(_id);
    return deleted;
  }
  
  async getProductById(_id) {
    const productById = await productModel.findOneProduct( _id );
    if (productById) {
      return productById;
    } else {
      return false;
    }
  }
  async getProductByIdView(pid) {
    const productById = await productModel.findOneProductView(pid);
    let prodView = [productById]
    return prodView;
  }
  
}

export const productService = new ProductService();
