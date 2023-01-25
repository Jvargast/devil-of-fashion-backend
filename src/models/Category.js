const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    title:{
        type:String,
        required:[true, "Ingresa nombre de la categoría"],
        trim:true
    },
    isLast: {
        type:Boolean,
        required: true
    },
    path: {
        type:String,
    },
    childrens: {
        type:Array
    },
    createdAt: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Category", categorySchema);