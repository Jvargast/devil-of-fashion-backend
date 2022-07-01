const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const User = require("../models/User");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

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


//Forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next) => {
    const user = await User.findOne({email:req.body.email});


    if(!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message  = `El link para cambiar contraseña es: \n\n ${resetPasswordUrl} \n\nSi no solicitaste un cambio de contraseña, por favor ignora este correo.`; 

    try {
        await sendEmail({
            email: user.email,
            subject: `DevilOfFashion - Recuperación de contraseña`,
            message
        });

        res.status(200).json({
            success:true,
            message: `Email enviado a ${user.email} exitosamente`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }
});


//Reset password
exports.resetPassword = catchAsyncError(async(req,res,next) =>{

    //creating token hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}});

    if(!user) {
        return next(new ErrorHandler("El link es inválido o ha expirado", 404));
    };

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Las contraseñas no coinciden", 404));
    };

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save()
    sendToken(user,200,res);
})