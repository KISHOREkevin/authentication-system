const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://admin-kishore:Test123@cluster0.yhnco9i.mongodb.net/usersDB");
const usersSchema = new mongoose.Schema({
    name:String,
    password:String
})
const User = mongoose.model("User",usersSchema);
let signUpMsg = "";
let logInMsg= "";
let recievedmsg = false;
app.get("/",(req,res)=>{
    if(recievedmsg==true){
        res.render("winner");
        

    }else{
        res.render("index",{loginMsg:logInMsg});
    }
})
app.post("/",(req,res)=>{
    let logUserName = req.body.logUserName;
    let logPassWord = req.body.logPassWord;
    User.findOne({name:logUserName,password:logPassWord},(err,foundItem)=>{
        if(err){
            console.log(err);
        }else{
            if(foundItem){
                recievedmsg = true;
                logInMsg="";
                res.redirect("/");
            }else{
                recievedmsg=false; 
                logInMsg="Account Doesn't Exists !!!";
                res.redirect("/");
            }
        }
    })
})

app.get("/signup",(req,res)=>{
    res.render("signup",{errorMsg:signUpMsg});
})
app.post("/signup",(req,res)=>{
    let signUserName = req.body.signUserName;
    let signPassword1 = req.body.signPassWord1;
    let signPassword2 = req.body.signPassWord2;
    User.findOne({name:signUserName,password:signPassword2},(err,foundItem)=>{
            if(err){
                console.log(err);
            }else{
                if(signPassword1===signPassword2){
                    if(foundItem){
                        signUpMsg="Account already exists !!!";
                        res.redirect("/signup");
                    }else{
                        const user = new User({
                            name:signUserName,
                            password:signPassword2
                        })
                        user.save();
                        signUpMsg="";
                        res.redirect("/");
                    }
                }else{
                    signUpMsg = "Passwords doesnt match !!!";
                    res.redirect("/signup");
                }
            }
    })



})

app.post("/logout",(req,res)=>{
        recievedmsg=false;
        res.redirect("/");
})

app.listen(3000,()=>{
    console.log("Server Started @ 3000 .....");
})