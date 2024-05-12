const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200")
})


const recipesSchema = new mongoose.Schema({
    name: {
        type: String,
        
    },
    recipe: {
        type: String,
        
    },
    ingredients: {
        type: String,
        
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: "User"
    },
    images: [
    {
        url: String,
        filename: String
    }
    ],
    description: {
        type: String,
      
    }
    
})

const Recipes = mongoose.model("Recipes", recipesSchema)

module.exports = Recipes