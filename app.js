const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const config = require('./config/jwt.json');
const indexRouter = require('./index.js');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/index', indexRouter);

app.get('/', (req, res)=>{
    res.send("Open Successfully!");
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    //check from database
    if (!email || !password) {
        return res
        .status(400)
        .json({ success: false, error: "enter valid credientials" });
    }

    //if expired, jwtwebtoken will send 401 error
    //fron-end keep it and send refresh request
    const accessToken = jwt.sign({ email: email }, config.accessScret, {
        expiresIn: "10m",
    });
    const refreshToken = jwt.sign({ email: email }, config.refreshSecret, {
        expiresIn: "1h",
    });

    return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.post('/logout', (req, res)=>{
    //cancel the refresh token in database
    
});

app.listen(port, ()=>{
    console.log("Server listen on "+port);
});