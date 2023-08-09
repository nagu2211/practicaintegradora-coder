import { productService } from "../services/product.service.js";
import ProductDTO from "../DAO/DTO/product.dto.js";

class ProductsController {
  getAll = async (_, res) => {
    try {
      const resp = await productService.getAll();
      return res.status(200).json({
        status: "success",
        msg: "all products",
        payload: resp,
      });
      
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  };

  productById = async (req, res) => {
    try {
      const _id = req.params._id;
      const product = await productService.getProductById(_id);
      if (product) {
        return res.status(200).json({
          status: "success",
          msg: "product found",
          payload: product,
        });
      } else {
        return res
          .status(404)
          .json({ status: "error", msg: "product not found", payload: {} });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }

  addProduct = async (req, res) => {
    try {
      const product = req.body;
      const productDTO = new ProductDTO(product);
      const productAdded = await productService.addProduct(productDTO);
  
      if (productAdded == false) {
        return res.status(404).json({
          status: "error",
          msg: "Not added: the product is repeated",
          payload: {},
        });
      } else {
        return res.status(201).json({
          status: "success",
          msg: "product added",
          payload: {},
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }
  updateProduct = async (req, res) => {
    try {
      const _id = req.params._id;
      const updaProd = req.body;
      const updateProd = await productService.updateProduct(_id, updaProd)
  
     
  
      if (updateProd == false) {
        return res
          .status(404)
          .json({ status: "error", msg: "product not found", payload: {} });
      } else if (updateProd == null){
        return res
        .status(401)
        .json({ status: "error", msg: "existing values", payload: {} });
      } else{
        return res.status(200).json({
          status: "success",
          msg: "product updated",
          payload:updateProd,
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }
  deleteProduct =  async (req, res) => {
    try {
      const _id = req.params._id;
      const deleted = await productService.deleteOne(_id);
      if (deleted?.deletedCount > 0) {
        return res.status(200).json({
          status: "success",
          msg: "product deleted",
          payload: {},
        });
      } else {
        return res.status(404).json({
          status: "error",
          msg: "Product not found",
          payload: {},
        });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: "error",
        msg: "something went wrong :(",
        payload: {},
      });
    }
  }
}

export const productsController = new ProductsController();
