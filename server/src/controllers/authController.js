import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/tokenGenerate.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
        const validatedData = registerSchema.parse(req.body);
        const {username,email,password} = validatedData;

        // no longer needed zod le herxa yo aba
//         if (!username || !email || !password) {
//     return res.status(400).json({
//         message: "All fields are required"
//     });
// }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        // Save user to database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
});

export const loginUser = asyncHandler (async (req,res) => {
        const {email,password} = loginSchema.parse(req.body);

        //USER CHECK
        const user = await User.findOne({email});
        if (!user){
            return res.status(401).json({message:"invalid creentials"});
        }

        //MEMORY POWER CHECK
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid creentials"});
        }

        //TOKEN GENERATION
        const token = generateToken(user._id);

        res.status(200).json({
            message:"login success",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });
});