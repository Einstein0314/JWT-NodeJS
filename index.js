//index endpoint
var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const { isAuthenticated, verifyRefresh } = require("./auth/auth");
const config = require('./config/jwt.json');


router.get("/protected", isAuthenticated, (req, res) => {
  res.json({ 
    success: true, 
    msg: "Welcome user!!", 
    email: req.email
  });
});

router.get('/refresh', (req, res)=>{
    const { email, refreshToken } = req.body;
    const isValid = verifyRefresh(email, refreshToken);
    if (!isValid) {
        return res
        .status(401)
        .json({ success: false, error: "Invalid token,try login again" });
    }
    const accessToken = jwt.sign({ email: email }, config.accessScret, {
        expiresIn: "2m",
    });
    return res.status(200).json({ success: true, accessToken: accessToken });
})

module.exports = router;