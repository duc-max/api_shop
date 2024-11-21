import express from "express";
import {
  addToCart,
  getCart,
  minusItem,
  payment,
  plusItem,
  remove,
  updateCart,
  order,
  removeAll,
} from "../controller/cart";

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.delete("/remove/:uid/:pid", remove);
router.delete("/remove-all/:id", removeAll);
router.put("/update/:id", updateCart);
router.put("/plus", plusItem);
router.put("/minus", minusItem);
router.post("/payment", payment);
router.post("/order", order);

export default router;
