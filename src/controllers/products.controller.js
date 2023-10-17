import { productService } from '../services/product.service.js';
import ProductDTO from '../DAO/DTO/product.dto.js';
import CustomError from '../services/errors/custom-error.js';
import { generateProductErrorInfo } from '../services/errors/info.js';
import Errors from '../services/errors/enums.js';
import { formatCurrentDate } from '../utils/currentDate.js';
import { emailService } from '../services/email.service.js';

class ProductsController {
  getAll = async (req, res) => {
    try {
      const resp = await productService.getAll();
      return res.status(200).json({
        status: 'success',
        msg: 'all products',
        payload: resp,
      });
    } catch (e) {
      req.logger.error(`Error in getAll : ${e.message}` + formatCurrentDate);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
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
          status: 'success',
          msg: 'product found',
          payload: product,
        });
      } else {
        return res.status(404).json({ status: 'error', msg: 'product not found', payload: {} });
      }
    } catch (e) {
      req.logger.error(`Error in productById : ${e.message}` + formatCurrentDate);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  };

  addProduct = async (req, res) => {
    try {
      const product = req.body;
      const ownerEmail = req.session.user.email;
      let ownerProduct = req.session.user.role == 'admin' ? 'admin' : ownerEmail;
      try {
        const productDTO = new ProductDTO(product, ownerProduct);
        const productAdded = await productService.addProduct(productDTO);
        if (productAdded == false) {
          return res.status(409).json({
            status: 'error',
            msg: 'Not added: the product is repeated',
            payload: {},
          });
        } else {
          return res.status(201).json({
            status: 'success',
            msg: 'product added',
            payload: productAdded,
          });
        }
      } catch (e) {
        CustomError.createError({
          name: 'Product add Error',
          cause: generateProductErrorInfo(product),
          message: 'Error trying to add product',
          code: Errors.REQUIRED_FIELDS,
        });
      }
    } catch (e) {
      req.logger.error(`Error in addProduct : ${e.cause}` + formatCurrentDate);
      return res.status(500).json({
        status: 'error',
        name: e.name,
        cause: e.cause,
      });
    }
  };
  updateProduct = async (req, res) => {
    try {
      const _id = req.params._id;
      const updaProd = req.body;
      const updateProd = await productService.updateProduct(_id, updaProd);

      if (updateProd == false) {
        return res.status(404).json({ status: 'error', msg: 'product not found', payload: {} });
      } else if (updateProd == null) {
        return res.status(401).json({ status: 'error', msg: 'existing values', payload: {} });
      } else {
        return res.status(200).json({
          status: 'success',
          msg: 'product updated',
          payload: updateProd,
        });
      }
    } catch (e) {
      req.logger.error(`Error in updateProduct : ${e.message}` + formatCurrentDate);
      return res.status(500).json({
        status: 'error',
        msg: 'something went wrong :(',
        payload: {},
      });
    }
  };
  deleteProduct = async (req, res) => {
    try {
      const _id = req.params._id;
      const foundProduct = await productService.getProductById(_id);
      let ownerOfProduct = foundProduct.owner;
      let titleOfProduct = foundProduct.title;
      console.log(ownerOfProduct)
      switch (req.session.user.role) {
        case 'admin':
          const deleted = await productService.deleteOne(_id);
          if (deleted?.deletedCount > 0) {
            if (ownerOfProduct != 'admin') {
              await emailService.productRemovalNoticeEmail(ownerOfProduct,titleOfProduct);
              res.status(200).render('success', { msg: 'product deleted' });
            } else {
              res.status(200).render('success', { msg: 'product deleted' });
            }
          } else {
            res.status(404).render('error-page', { msg: 'product not found' });
          }
          break;
        case 'premium':
          if (ownerOfProduct == req.session.user.email) {
            const deleted = await productService.deleteOne(_id);
            if (deleted?.deletedCount > 0) {
              res.status(200).render('success', { msg: 'product deleted' });
            } else {
              res.status(404).render('error-page', { msg: 'product not found' });
            }
          } else {
            res.status(401).render('error-page', { msg: 'unauthorized user' });
          }
          break;
        default:
          res.status(401).render('error-page', { msg: 'unauthorized user' });
          break;
      }
    } catch (e) {
      req.logger.error(`Error in deleteProduct : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'something went wrong in the server' });
    }
  };
}

export const productsController = new ProductsController();
