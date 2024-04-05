const mongoose = require("mongoose");
const Category = require("../models/category.model");

const createCategory = async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next("Name is required");
  }
  try {
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return next("Already exists");
    }

    const category = await new Category({ name }).save();
    res.status(200).json({
      success: true,
      category,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.params;
  try {
    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return next("Category not foun");
    }

    category.name = name;

    const updatedCategory = await category.save();
    res.status(200).json({
      success: true,
      data: updatedCategory,
    });
  } catch (err) {
    console.err(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const removeCategory = async (req, res, next) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    res.status(200).json({
      success: true,
      message: "category deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const readCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ _id: req.params.categoryId });
    res.json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const listCategory = async (req, res, next) => {
  //   console.log("list category");
  try {
    const all = await Category.find({});
    res.json({
      success: true,
      data: all,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  removeCategory,
  readCategory,
  listCategory,
};
