const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Ingresa nombre del producto"],
        trim:true
    },
    description:{
        type:String,
        required:[true, "Ingresa descripción del producto"]
    },
    price: {
        type:Number,
        required: [true, "Ingresa el precio del producto"]
    },
    ratings:{
        type:Number,
        default:0
    },
    images: [{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    }],
    category: {
        type:String,
        required:[true, "Ingresa categoría"]
    },
    subCategory: {
        type:String,
        required:[true, "Ingresa sub categoría"]
    },
    hashtag: {
        type: String,
        
    },
    stock:{
        type:Number,
        required:[true, "Ingresa cantidad del producto"],
        maxLenght:[4, "Stock no puede exceder"],
        default:1
    },
    numOfReviews: {
        type: Number,
        default:0
    },
    reviews: [
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true
            },
            rating: {
                type:Number,
                required:true,
            },
            comment: {
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type:Date,
        default:Date.now,
        select:false
    }
})

module.exports = mongoose.model("Product", productSchema);