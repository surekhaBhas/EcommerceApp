const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
 
  product_name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.ObjectId,
    ref: "Category",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  Image: {
    data: Buffer,
    contentType: String,
  },
  shipping: {
    type: Boolean,
  },
},
{ timestamps: true })

module.exports=mongoose.model("Products",productSchema)