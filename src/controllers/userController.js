const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/User");
const sendToken = require("../utils/jwtToken");

//Register a user
exports.registerUser = catchAsyncError(async(req,res,next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name,email,password
    });
    sendToken(user,201,res);
});

//Login user
exports.loginUser = catchAsyncError(async(req,res,next) => {
    const {email, password} = req.body;

    //checking if user has given password and email both

    if(!email || !password) {
        return next(new ErrorHandler("Por favor ingresar email y contraseña", 400));
    };

    const user = await User.findOne({email}).select("+password");

    if(!user) {
        return next(new ErrorHandler("Email o contraseña inválida"), 401);
    };

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Contraseña inválida"), 401);
    };

    sendToken(user,200,res);
});

//Logout User

exports.logOut = catchAsyncError(async(req,res,next)=> {
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message: "Logged Out"
    })
})

