const Category=require('../models/CategoryModel')
const slugify= require('slugify') 


const createCategoryController=async(req,res)=>{
    try{
    const {name}=req.body
    if(!name){
        return res.status(401).send({
            message:"Name is required"
        })
    }

    const existingCategory=await Category.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"Category Already Exists"
        })
    }
     const category=await  Category.create({
        name,slug:slugify(name)
     })
    
     res.status(201).send({
        success:true,
        message:'new category created',
        category
     })

    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            message:"Error in Category"
        })
    }
}

const updateCategoryController = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
  
      // Find the category by ID
      const category = await Category.findById(id);
  
      // Check if the category exists
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
  
      // Update the category properties
      category.name = name;
      category.slug = slugify(name);
      category.new = true;
  
      // Save the updated category
      await category.save();
  
      res.status(200).send({
        success: true,
        message: "Category updated successfully",
        category,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        success: false,
        err,
        message: "Error while updating category",
      });
    }
  };
  

const categoryController=async(req,res)=>{
    try{
        const category=await Category.find()
        res.status(200).send({
            success:true,
            message:'All categories List',
            category
        })
    }catch(err){
        console.error(err);
        res.status(500).send({
          success: false,
          err,
          message: "Error while getting all categories",
        });
    }

}


const singleCategoryController=async(req,res)=>{
    try{
        const {slug}=req.params
        const category=await Category.findOne({"slug":slug})
        res.status(200).send({
            success:true,
            message:"Get single Category Successfully",
            category
        })
    }catch(err){
        console.error(err);
        res.status(500).send({
          success: false,
          err,
          message: "Error while getting single categories",
        });
    }
}

const deleteCategoryController=async(req,res)=>{
    const {id}=req.params
    try{
         await Category.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully"
        })
    }catch(err){
        console.error(err);
        res.status(500).send({
          success: false,
          err,
          message: "Error while Deleting single categories",
        });
    }
}

module.exports={createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController}

