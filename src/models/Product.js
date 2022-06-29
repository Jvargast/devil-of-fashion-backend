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
    rating:{
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
    createdAt: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);