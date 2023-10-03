const express=require('express')
const router=express.Router()
const {requireSignIn,isAdmin}=require('../middlewares/authMiddeleware');
const {createProductController,
    getProductController,
    getSingleProduct,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFilterController,
    productCountController,
    productListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    brainTreePaymentController }=require('../controllers/productController')
const formidable =require("express-formidable")

//create product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//get All products
router.get('/get-product',getProductController)

//get one product 
router.get('/get-product/:id',getSingleProduct)
module.exports=router

//get product photo 
router.get('/product-photo/:pid',productPhotoController)

//delete product 
router.delete('/delete-product/:pid',requireSignIn,isAdmin,deleteProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)


router.post('/product-filters',productFilterController)

router.get('/product-count',productCountController)

router.get('/product-list/:page',productListController)


router.get('/search/:keyword',searchProductController)


router.get('/related-product/:pid/:cid',relatedProductController)

router.get("/product-category/:id", productCategoryController);


router.get("/braintree/token",braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController 
);