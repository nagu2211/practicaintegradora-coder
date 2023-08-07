import { productModel } from "../models/product.model.js";

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

  async addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
  }) {
    const originalProduct = await productModel.findByCode(code);
    if (originalProduct) {
      return false;
    } else {
      const productAdded = await productModel.createProduct(
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnail,
      );
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
  async getParams(queryParams) {
    const {
      limit = 10,
      page = 1,
      sort,
      query,
      category,
      disponibility,
    } = queryParams;
    let filter = {};
    let filterError = false;

    if (query != undefined) {
      switch (query) {
        case "category":
          if (category == "fruit") {
            filter = { category: category };
          } else if (category == "vegetable") {
            filter = { category: category };
          } else {
            filter = {};
            filterError = true;
          }
          break;
        case "disponibility":
          if (disponibility == "true") {
            filter = { status: true };
          } else if (disponibility == "false") {
            filter = { status: false };
          } else {
            filter = {};
            filterError = true;
          }
          break;
        default:
          filter = {};
          filterError = true;
      }
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort === "desc" ? "-price" : sort === "asc" ? "price" : undefined,
    };

    const result = await productModel.paginatePersonalized(filter, options);

    const resp = {
      status: filterError === true ? "error" : "success",
      msg:
        filterError === true
          ? "without filters"
          : query
          ? `filter by ${query}`
          : "without filters",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}`
        : null,
    };

    return resp;
  }
}

export const productService = new ProductService();
