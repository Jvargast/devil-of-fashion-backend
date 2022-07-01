const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Ingresa tu email"],
        maxLength: [30,"Nombre no puede exceder de los 30 carácteres"],
        minLength: [4, "Nombre debe tener más de 4 carácteres"]
    },
    email: {
        type:String,
        required: [true, "Ingresa tu email"],
        unique:true,
        validate:[validator.isEmail, "Ingresa un email válido"]
    },
    password: {
        type:String,
        required: [true, "Ingresa tu contraseña"],
        minLength:[8,"La contraseña debe ser mayor a 8 carácteres"],
        select:false,
    },
    role: {
        type:String,
        default: "user",

    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
});

//JWT Token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({id:this._id},`${process.env.JWT_SECRET}`,{
        expiresIn:`${process.env.JWT_EXPIRE}`,
    });
};

//Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

//Generate Password reset token
userSchema.methods.getResetPasswordToken = function() {
    //Generating token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 *60*1000;

    return resetToken;
}

module.exports = mongoose.model("User",userSchema);