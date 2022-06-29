const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


//Create product -- Admin
exports.createProduct = catchAsyncError(async (req,res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
});


// Get all products
exports.getAllProducts = catchAsyncError(async (req,res) => {
    const resultPerPage = 5;
    const productCount = await Product.countDocuments();
    const apifeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    /* const products = await Product.find(); */
    const products = await apifeature.query;
    res.status(200).json({
        success: true, 
        products,
        productCount
    });
});

//Get product details
exports.getProductDetails = catchAsyncError(async(req,res,next)=> {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Producto no encontrado", 404));
    };

    res.status(200).json({
        success:true,
        product,
    })
});

//Update product -- Admin
exports.updateProduct = catchAsyncError(async (req,res,next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        return res.status(500).json({
            success:false,
            message: "Producto no encontrado"
        })
    };

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success:true,
        product
    })

});

//Delete Product

exports.deleteProduct = catchAsyncError(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product) {
        return res.status(500).json({
            success:false,
            message:"Producto no encontrado"
        })
    }
    await product.remove();

    res.status(200).json({
        success:true,
        message:"Producto eliminado con éxito"
    })
});