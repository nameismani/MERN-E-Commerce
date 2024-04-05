const mongoose = require("mongoose");
const Product = require("../models/productmodel");

const fetchProducts = async (req, res, next) => {
  const { keyword } = req.query;
  try {
    const pageSize = 6;

    const key = keyword
      ? {
          name: {
            $regex: keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...key });
    const products = await Product.find({ ...key }).limit(pageSize);

    res.status(200).json({
      success: true,
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const addProduct = async (req, res, next) => {
  const { name, description, price, category, quantity, brand } = req.fields;
  try {
    // Validation
    switch (true) {
      case !name:
        return next("Name is required");
        return res.json({ error: "Name is required" });
      case !brand:
        return next("Brand is required");
        return res.json({ error: "Brand is required" });
      case !description:
        return next("Description is required");
        return res.json({ error: "Description is required" });
      case !price:
        return next("Price is required");
        return res.json({ error: "Price is required" });
      case !category:
        return next("Category is required");
        return res.json({ error: "Category is required" });
      case !quantity:
        return next("Quantity is required");
        return res.json({ error: "Quantity is required" });
    }

    const product = new Product({ ...req.fields });
    await product.save();
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const fetchAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createAt: -1 });

    res.json({
      status: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

const fetchTopProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

module.exports = {
  fetchProducts,
  addProduct,
  fetchAllProducts,
  addProductReview,
  fetchProducts,
};
