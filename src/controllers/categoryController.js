const Category = require("../models/Category");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//Create product -- Admin
exports.createCategory = catchAsyncError(async (req, res, next) => {

  req.body.path = req.body.title;
  const childrens = req.body.childrens;
  
  for(let i = 0; i<childrens.length; i++) {
    childrens[i].path = req.body.childrens[i].title;

    for(let j = 0; j<childrens[i].childrens.length;j++) {
        req.body.childrens[i].childrens[j].path = "&category="+req.body.title +"&hashtag="+childrens[i].childrens[j].title
    }
  } 
  
  //&category=${}&hashtag=${}
  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    category,
  });
});

exports.getCategories = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});
