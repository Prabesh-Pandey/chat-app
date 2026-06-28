import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/tokenGenerate.js";

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
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
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;

        //VACANCY ANNOUNCEMENT
        if (!email || !password){
            return res.status(400).json({message:"NO YOU CAN'T LEAVE THE FIELDS EMPTY AND HIT SUBMIT BROO!!"});
        }

        //USER CHECK
        const user = await User.findOne({email});
        if (!user){
            return res.status(400).json({message:"ARE YOU SURE YOU ARE NOT INTO CRIME? BCOZ USER NOT FOUND!!!"});
        }

        //MEMORY POWER CHECK
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"AWW SOMEBODY FORGET TO EAT ALMOND TODAY HAHA"});
        }

        //TOKEN GENERATION
        const token = generateToken(user._id);

        res.status(200).json({
            message:"YO YO YO ",
            token,
            user:{
                id:user._id,
                username:user.username,
                email:user.email
            }
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:"Internal server error"});
    }
};