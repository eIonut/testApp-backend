const router = require("express").Router();

const authMiddleware = require("./middlewares/authMiddleware");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("./controllers/Product");

const { registerUser, loginUser } = require("./controllers/User");

router.get("/products", authMiddleware, getProducts);
router.get("/products/:id", authMiddleware, getProduct);
router.post("/products", authMiddleware, createProduct);
router.put("/products/:productID", authMiddleware, updateProduct);
router.delete("/products/:productID", authMiddleware, deleteProduct);
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
