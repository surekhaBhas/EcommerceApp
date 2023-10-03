const jwt=require('jsonwebtoken');
const Users=require('../models/User')

const requireSignIn = async (req, res, next) => {
    try {
      const token = authHeader=req.headers['authorization'].split(' ')[1]
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "JWT token is missing"
        });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Assuming you want to store the decoded user information in the request
  
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        success: false,
        message: "Invalid JWT token"
      });
    }
  }
  


// admin access
const isAdmin = async (req, res, next) => {
    try {
      const user = await Users.findOne({ _id: req.user._id });
      if (user.role !== 1) {
        return res.status(401).send({
          success: false,
          message: "UnAuthorized Access"
        });
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
    }
  };
  

module.exports={requireSignIn,isAdmin}