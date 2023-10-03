const express=require('express');
const router=express.Router()
const {requireSignIn,isAdmin}=require('../middlewares/authMiddeleware')
const {createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController}=require('../controllers/categoryController')

//create Category
router.post("/create-category",requireSignIn,isAdmin,createCategoryController)

//update Category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)

//getAll Category
router.get('/all-category',categoryController)

//get single category
router.get('/single-category/:slug',singleCategoryController)

//Delete category
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)
module.exports=router