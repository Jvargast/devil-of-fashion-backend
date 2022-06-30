const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=> {
    const {token} = req.cookies;
    if(!token) {
        return next(new ErrorHandler("Please Login to access this resource", 403));
    };

    const decodedDate = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedDate.id);

    next();
});

exports.authorizeRoles = (...roles) => {
    return(req,res,next)=> {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Roles: ${req.user.role} is not allowed to this`,403));
        };
        next();
    }

    
}

