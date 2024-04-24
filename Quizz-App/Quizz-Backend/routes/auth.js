const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');


const JWT_SIGNATURE = 'JDFUASHUYRHEGLJKADRGNAJKRFGNJKAESGUKLAHBLSDUFHLAERFEF';


// Creating a User
router.post('/signup', [
    body('firstName').exists(),
    body('lastName').exists(),
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Length of Password is between 8 and 15 characters').isLength({ min: 8, max: 15 })
],
    async (req, res) => {
        console.log('Sign Up Page');
        try {

            const { firstName, lastName, email, password } = req.body;


            const errors = validationResult(req);

            console.log(errors);
            if (!errors.isEmpty()) {

                return res.status(400).json({ errors: errors.array() });
            }
            
            // Checking if the user exist or not
            let existUser = false;

            let user = await User.findOne({ email });
            
            if (user === null) {               
                
                console.log(user,'hello');
                // Hashing the password
                const salt = await bcrypt.genSalt(10);
                const secPass = await bcrypt.hash(req.body.password, salt);

                // creating the user

                user = await User.create({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: secPass
                });
                const data = {
                    user: {
                        id: user.id
                    }
                }
                console.log(data)
               
                return res.status(200).json('Successfull Sign Up');                
            }
            else{
                return res.status(400).json({ error: 'Sorry the Email is already registered with us' });
            }

        }
        catch (error) {
            res.status(500).json({ error: 'Internal Error Occured' });
        }
    });


// authenticating a user
router.post('/login',
    [
        body('email', 'Enter valid Email').isEmail(),
        body('password', 'Enter valid Email').exists(),
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json('Invalid Cdentials');
            }

            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json('Invalid Password');
            }

            // generating auth token when user is loggged in succesfully
            const payload = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(payload, JWT_SIGNATURE)
            console.log(authToken);
            res.status(200).json({ authToken });
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Error Occured' });
        }
    }
)


// getting Loggedin in USer Request getUser
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        let userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        
        res.send(user);
    } catch (error) {
        res.status(500).json({ error: 'Inteaertarnal Error Occured' });
    }
}
)


module.exports = router