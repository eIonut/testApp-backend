const Product = require("../models/Product");
const Joi = require("joi");
const multer = require("multer");
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
}).single("image");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().select("-__v");
    res.json(products);
  } catch (err) {
    res.send(err);
  }
};

const getProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    product.image = product.image.replace(/\\/g, "/");
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().positive().required(),
  image: Joi.string(),
});

const createProduct = async (req, res) => {
  try {
    // Use multer middleware to handle the image file
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // Return an HTTP 413 error response to the client
        return res.status(413).json({ error: "Payload too large" });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { error } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const product = new Product(req.body);
      const savedProduct = await product.save();

      res.json(savedProduct);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.productID },
      {
        $set: {
          name: req.body.name,
          description: req.body.description,
          category: req.body.category,
          price: req.body.price,
          image: req.body.image,
        },
      },
      { new: true }
    ).select("-__v");

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.deleteOne({ _id: req.params.productID });
    res.json({ message: "Product Deleted" });
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
};
