const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// 帳號註冊
router.post("/register", async (req, res) => {
    // 先檢查資料合法性

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        // 密碼加密 CryptoJS
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})

// 登入 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username })
        !user && res.status(401).json("Wrong Credentials")

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const orginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        
        orginalPassword !== req.body.password && res.status(401).json("Wrong Credentials")

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
        {expiresIn: "3d"}
        );

        // res.status(200).json(user);
        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken});
    } catch {
        res.status(500).json(err);
    }
});

module.exports = router;