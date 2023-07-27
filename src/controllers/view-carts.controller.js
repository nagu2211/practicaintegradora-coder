import { cartService } from "../services/cart.service.js";


class ViewCartsController {
  getOneCart =  async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartService.getOneCart(cid);
      return res.status(200).render("cart", { cart });
    } catch (e) {
      console.log(e);
      return res.status(500).render("error-page",{msg:"unexpected error on the server"});
    }
  }
}

export const viewCartsController = new ViewCartsController();
