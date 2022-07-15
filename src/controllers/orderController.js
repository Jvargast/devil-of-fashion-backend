const Order = require("../models/Order");
const Product = require("../models/Product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");

//Create new Order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  })


});

//Get single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
        return next(new ErrorHandler("Order not found with this id", 404));
    }

    res.status(200).json({
        success:true,
        order,
    })

});

//Get logged in user Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders,
    })

});

//Get all orders -- Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount+=order.totalPrice;
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    })

});

//update order status -- Admin
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.orderStatus === "Delivered") {
        return next(new ErrorHandler("Ya has enviado este producto", 400));
    };

    order.orderItems.forEach(async(o)=> {
        await updateStock(o.product,o.quantity);
    });

    order.orderStatus = req.body.status;
    
    if(req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    };

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    })

});

async function updateStock (id, quantity) {
    const product = await Product.findById(id);

    product.stock-= quantity;

    await product.save({validateBeforeSave:false});
};

//delete order -- Admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    await order.remove()

    res.status(200).json({
        success:true,
    })

});