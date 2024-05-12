const mongoose = require("mongoose")
const User = require("../models/user")
const Recipes = require("../models/recipes")
const {recipes, ingredients} = require("./recipes")
const {descriptors, foods} = require("./seedHelpers")

mongoose.connect('mongodb://127.0.0.1:27017/food-receipts')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
      console.log("Database connected")
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)]

  const seedDB = async () => {
    await Recipes.deleteMany({});
    for (let i=0; i<20; i++){
        const random1000 = Math.floor(Math.random() * 10);
       const recipe = new Recipes({
        name: `${sample(descriptors)} ${sample(foods)}`,
        ingredients: `${recipes[random1000].ingredients}`,
        recipe: `${recipes[random1000].recipe}`,
        images:  [
          {
            url: 'https://res.cloudinary.com/dzpcfeg7c/image/upload/v1698144711/foodrecipes/q48phyaonulvva5kpqso.jpg',
            filename: 'foodrecipes/q48phyaonulvva5kpqso',
     
          },
          {
            url: 'https://res.cloudinary.com/dzpcfeg7c/image/upload/v1698144724/foodrecipes/nkkyuuo9ozykqixtczh6.jpg',
            filename: 'foodrecipes/nkkyuuo9ozykqixtczh6',
   
          },
          {
            url: 'https://res.cloudinary.com/dzpcfeg7c/image/upload/v1698144727/foodrecipes/mfbslgwkngqhgtckvg5h.jpg',
            filename: 'foodrecipes/mfbslgwkngqhgtckvg5h',
   
          },
          {
            url: 'https://res.cloudinary.com/dzpcfeg7c/image/upload/v1698144728/foodrecipes/bb6cr2c86if5cgfj7qxp.jpg',
            filename: 'foodrecipes/bb6cr2c86if5cgfj7qxp',
       
          },
          {
            url: 'https://res.cloudinary.com/dzpcfeg7c/image/upload/v1698144738/foodrecipes/qjr43ispqwlfdewdm7y0.jpg',
            filename: 'foodrecipes/qjr43ispqwlfdewdm7y0',
       
          }
        ]
       })
        await recipe.save()
    }
}

seedDB()