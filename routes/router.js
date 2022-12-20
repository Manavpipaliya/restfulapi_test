const express = require('express');

const router = express.Router();

 const  User = require('../models/models');
 const { body, validationResult } = require('express-validator');
 const { check } = require('express-validator');


//Post Method
router.post('/post', body('email' , 'enter valid email').isEmail().normalizeEmail(),check('email').isEmail().withMessage({
    message: 'Not an email',
    errorCode: 1,
  }),

  // check email is already in use
  check('email').custom(async (value) => {
    const user = await User .findOne({
        email: value,
    });
    if (user) {
        throw new Error('Email already in use');
    }   
    }),
    

 body('name' , 'pls enter  valid name').isLength({ min: 3 }),

// body('password').isLength({ min: 5 }),
check('password', 'The password must be 5+ chars long and contain a number')
    .not()
    .isIn(['123', 'password', 'god'])
    .withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/),
  async(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

     const data = new User ({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password

     })
     
      try {
        const saveData = await data.save();
        res.json(saveData);

    

      } catch (err) {
        res.json({message : err})
        
      }


   
})

//Get all Method
router.get('/getAll', async(req, res) => {
     
    try{
        const data = await User.find();
        res.json(data).status(200);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
  
})

//Get by ID Method
router.get('/getOne/:id', async(req, res) => {

     const  id = req.params.id;
         const userbyid = User.findById(id);

         try {
            const user =  await userbyid;   
            res.json(user).status(200);
         }
         catch (err){
            res.status(500).json({message: err.message})
         }

  
})

//Update by ID Method
router.patch('/update/:id', async(req, res) => {

     const  id = req.params.id;
     const updateuserbyid = User.findByIdAndUpdate(id, req.body, {new :true})

     try {
         const updatedata = await updateuserbyid;
         res.json(updatedata).status(200);

     } catch (err){
        res.status(500).json({message: err.message})

     }



    // res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', async(req, res) => {

    try {
        const id = req.params.id;
        const deletedata = await User.findByIdAndDelete(id)
        res.send(`Document with ${deletedata.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
  
})


// login method 

router.post('/login', body('passwordConfirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),async(req,res)=>{
    const {email , password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message : "user not found"})

        }

        else {
            if (password === user.password){
                res.status(200).json({message : "login successfull"})
            }
        }
    }

    catch(err) {
        res.status(500).json({message : err.message})
    }

})



module.exports = router;