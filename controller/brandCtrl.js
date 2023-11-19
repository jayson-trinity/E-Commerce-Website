const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const { validateMongodbid } = require("../utils/validateMongodbid");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new: true});
    res.json(updateBrand);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

const getaBrand = asyncHandler (async (req, res) => {
    const {id} = req.params;
    validateMongodbid(id);
    try {
        const getaBrand = await Brand.findById(id);
        res.json(getaBrand);
    } catch (error) {
        throw new Error (error);
    }
})

const getAllBrands = asyncHandler(async (req, res) => {
    try {
        const getAllBrands = await Brand.find();
        res.json(getAllBrands);
    } catch (error) {
        throw new Error (error);
    }
})

module.exports = { createBrand, updateBrand, deleteBrand, getaBrand, getAllBrands };
