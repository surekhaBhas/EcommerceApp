const express=require('express')
const router=express.Router()
const {requireSignIn,isAdmin}=require('../middlewares/authMiddeleware')
const {registerController,
    loginController,
    testController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    orderStatusController,getAllusers}=require('../controllers/authController')

router.post('/register',registerController)

router.post('/login',loginController)
router.get('/test',requireSignIn,isAdmin,testController)


//forget password 
router.post('/forgot-password', forgotPasswordController)

//protected route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})


router.put('/profile',requireSignIn,updateProfileController)

router.get('/orders', requireSignIn,getOrdersController)

router.get('/all-orders',requireSignIn,getAllOrdersController)

router.put('/order-status/:orderId',requireSignIn,isAdmin, orderStatusController)

router.get('/all-users',requireSignIn,isAdmin,getAllusers)

module.exports=router