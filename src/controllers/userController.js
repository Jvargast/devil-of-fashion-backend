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

    const isPasswordMatched = await user.comparePassword(password);

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
        return next(new ErrorHandler("El usuario no existe", 404));
    }

    //Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    /* const resetPasswordUrl = `${process.env.FRONT_URL}/password/reset/${resetToken}`; */
    
    const message  = `El enlace para cambiar contraseña es: \n\n ${resetPasswordUrl} \n\nSi no solicitaste un cambio de contraseña, por favor ignora este correo.`; 

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
});

//Get User Details
exports.getUserDetails = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })

});

//Update User password
exports.updatePassword = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = user.comparePassword(req.body.oldPassword);


    if(!isPasswordMatched) {
        return next(new ErrorHandler("Contraseña antigua es incorrecta"), 400);
    };

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Las contraseñas no coinciden"), 400);
    };

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user,200,res);
});

//Update User profile
exports.updateProfile = catchAsyncError(async(req,res,next) => {
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }
    await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify: false
    });

    res.status(200).json({
        success:true,
    })
});

//Get all users -- admin
exports.getAllUser = catchAsyncError(async(req,res,next)=> {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
    
})


//Get single user -- admin
exports.getSingleUser = catchAsyncError(async(req,res,next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exit with: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user,
    });
});

//Update User Role -- admin
exports.updateUserRole = catchAsyncError(async(req,res,next) => {
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        userFindAndModify: false
    });

    if(!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400))
    }

    res.status(200).json({
        success:true,
    })
});

//Delete User Role  -- admin
exports.deleteUser = catchAsyncError(async(req,res,next) => {
    
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400))
    }

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
});

