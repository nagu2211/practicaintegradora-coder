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
  async getProductByIdView(_id) {
    const productById = await ProdModel.findOne({ _id: _id }).lean();
    return productById;
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

    const result = await ProdModel.paginate(filter, options);

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
