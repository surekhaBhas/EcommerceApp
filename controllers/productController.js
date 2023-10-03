const ProductModel = require('../models/ProductModel')
const orderModel=require("../models/orderModel")
const slugify= require('slugify') 
const categoryModel=require('../models/CategoryModel')
const braintree=require('braintree')
const dotenv=require('dotenv')

dotenv.config();
const fs=require('fs')

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController=async (req, res) => {
    try {
      const { product_name, description, price, category, quantity, shipping } =
        req.fields;
      const { Image } = req.files;
      
      switch (true) {
        case !product_name:
          return res.status(500).send({ error: "Product Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !quantity:
          return res.status(500).send({ error: "Quantity is Required" });
        case Image && Image.size > 1000000:
          return res
            .status(500)
            .send({ error: "image is Required and should be less then 1mb" });
      }
  
      const products = new ProductModel({ ...req.fields, slug: slugify(product_name) });
      if (Image) {
        products.Image.data = fs.readFileSync(Image.path);
        products.Image.contentType = Image.type;
      }
      await products.save();
      res.status(201).send({
        success: true,
        message: "Product Created Successfully",
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in creating product",
      });
    }
  };

const getProductController=async(req,res)=>{
    try{
        const products=await ProductModel.find({}).populate('category').select("-Image").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:'All Products',
            products,
            countTotal:products.length,
        })
    }catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error in getting product",
        });
      }
} 

const getSingleProduct=async(req,res)=>{
    try{
        const product=await ProductModel.findOne({_id:req.params.id}).populate('category').select('-Image')
        res.status(200).send({
            success:true,
            message:"Single Product Fetched",
            product
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
          success: false,
          err,
          message: "Error in getting one product",
        });

    }

}



const productPhotoController=async(req,res)=>{
   try{
    const product=await ProductModel.findById(req.params.pid).select('Image')
    if(product.Image.data){
        res.set('Content-type',product.Image.contentType)
        return res.status(200).send(product.Image.data)
    }
   }catch(err){
    console.log(err)
    res.status(500).send({
      success:false,
      err,
      message:"Error while getting photo"
    })
   }
}

const deleteProductController=async(req,res)=>{
  try{
    await ProductModel.findByIdAndDelete(req.params.pid).select('-Image')
    res.status(200).send({
      success:true,
      message:"Product Deleted successfully"
    })
  }catch(err){
    console.log(err)
    res.status(500).send({
      success:false,
      err,
      message:"Error while deleting product"
    })
  }
}

const updateProductController=async(req,res)=>{
  try {
    const { product_name, description, price, category, quantity, shipping } =
      req.fields;
    const { Image } = req.files;
    
    switch (true) {
      case !product_name:
        return res.status(500).send({ error: "Product Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case Image && Image.size > 1000000:
        return res
          .status(500)
          .send({ error: "Image is Required and should be less then 1mb" });
    }

    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(product_name) },
      { new: true }
    );
    if (Image) {
      products.Image.data = fs.readFileSync(Image.path);
      products.Image.contentType = Image.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};


  const productFilterController=async(req,res)=>{
    try{
      const{checked,radio}=req.body 
      let args={}
      if(checked.length>0) args.category=checked
      if(radio.length) args.price={$gte:radio[0],$lte:radio[1]}
      const products=await ProductModel.find(args)
      res.status(200).send({
        success:true,
        products
      })
    }catch(err){
      console.log(err)
      res.status(500).send({
        success: false,
        err,
        message: "Error while filtering Products",
      });
    }
  }

  const productCountController=async(req,res)=>{
    try{
      const total=await ProductModel.find({}).estimatedDocumentCount()
      res.status(200).send({
        success:true,
        total
      })
    }catch(err){
      console.log(err)
      res.status(500).send({
        success: false,
        err,
        message: "Error while count Products",
      });
    }
  }
  
const productListController=async(req,res)=>{
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel
      .find({})
      .select("-Image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
}


 const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-Image");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};


const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-Image")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while getting related product",
      error,
    });
  }
};

const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ _id: req.params.id });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};


const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
  module.exports={
    createProductController,
    getProductController,
    getSingleProduct,
    productPhotoController,
    productPhotoController,
    deleteProductController
    ,updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController ,brainTreePaymentController}