const BCategory = require('../models/blogCategoryModel');
const asyncHandler = require("express-async-handler");
const { validateMongodbid } = require("../utils/validateMongodbid");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BCategory.create(req.body);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const updatedCategory = asyncHandler (async (req, res) => {
  const { id } = req.params;
  try {
    const updatedCategory = await BCategory.findByIdAndUpdate(id, req.body, { new: true});
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await BCategory.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

const getaCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const getaCategory = await BCategory.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error (error);
    }
})

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const getAllCategories = await BCategory.find();
        res.json(getAllCategories);
    } catch (error) {
        throw new Error (error);
    }
})

module.exports = { createCategory, updatedCategory, deleteCategory, getaCategory, getAllCategories };
