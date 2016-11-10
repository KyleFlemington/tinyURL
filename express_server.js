"use strict"
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080


// users[userID].urls
const password = 'kyle';
let hashed_password = bcrypt.hashSync(password, 10)

var users = {
  'UZ6Nia': {
    email: 'Kyle@kyle.com',
    username: 'Kyle',
    password:  hashed_password,
    urls: {
      "9sm5xK": "http://www.google.com",
      "zu7cwx": "http://www.drugsandmirrors.com",
      "8h4klw":"http://www.lighthouselabs.ca"
    }
  } 
};




app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.listen(PORT, () => {
});


//Home Page
app.get("/", (req, res) => { 
  res.render("urls_home")
});


//Registration Page
app.get("/register" , (req, res) => {
res.render("urls_registration")
});


//Registration Handler
app.post("/register", (req, res) => {

  if (req.body["email"] === '') {
    res.status(400);
    return res.send("Email field is empty");
  }

  if (req.body["password"] === '') {
    res.status(400);
    return res.send("Password field is empty");
  }

  if (req.body["username"] === '') {
    res.status(400);
    return res.send("Username field is empty");
  }
  var emailInUse = false;

  for (var userID in users) {
    if (users[userID].email === req.body.email) {
      emailInUse = true;
    }
  }
  if (emailInUse) {
    res.status(400);
    return res.send("Email already in use");
  }

  var newUserID = generateRandomUserID()

  users[newUserID] = {
    username: req.body["username"],
    password: req.body["password"],
    email: req.body["email"]
  };

  //req.cookies["user"] = newUserID;
  res.cookie("user", newUserID)
  res.redirect("/urls")
});


//Login Page
app.get("/login", (req, res) => {
res.render("urls_login")
});

app.post("/login" , (req, res) => {
  var user = null;

  for (var userID in users) {
    if (users[userID].email === req.body.email) {
      user = userID;
    }
  }
  if (!user) {
    res.status(403);
    return res.send("User Cannot Be Found");
  }
  let hashed_password = bcrypt.hashSync(req.body.password, 10)
  bcrypt.compareSync(users[user].password, hashed_password) 
    
  if (user) {
    res.status(400);
  }


  res.cookie("user", user) 
  res.redirect("/urls")
});


//Main Index
app.post("/urls", (req, res) => {
  let userID = req.cookies["user"]; 
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  
  users[userID].urls[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls", (req, res) => {
  let userID = req.cookies["user"];
  res.render("urls_index", {
    urls: users[userID].urls,
    username: users[userID].username
  });
});


app.get("/u/:shortURL", (req, res) => {
  let userID = req.cookies["user"];
  let longURL = users[userID].urls[req.params.shortURL]
  res.redirect(longURL);
});



//Logout
app.post("/logout", (req, res) => {
  res.cookie("user", null);  
  res.redirect("/urls")
});



//Submit New
app.get("/urls/new", (req, res) => {
  let userID = req.cookies["user"];
	let templateVars = {
		username: req.cookies["username"]
	}
  res.render("urls_new", templateVars);
});


//Unique ID Webpage
app.get("/urls/:id", (req, res) => {
  let userID = req.cookies["user"];

  let templateVars = { 
  	shortURL: req.params.id, 
  	actualURL: users[userID].urls[req.params.id],
  	username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});



//Delete
app.post("/urls/:shortURL/delete" , (req, res) => {
  let userID = req.cookies["user"];
	delete users[userID].urls[req.params.shortURL]
	res.redirect("/urls");
});


//Update
app.post("/urls/:shortURL/update"  , (req, res)  => {
  let userID = req.cookies["user"];
	const theNewURL = (req.body.longURL)
	const theOldURL =  users[userID].urls[req.params.shortURL]
	users[userID].urls[req.params.shortURL] = theNewURL
	res.redirect("/urls");
});


//Random User ID
function generateRandomUserID() {
  var userID = "";
  var idGenER = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i <= 5; i++) {
    userID += idGenER.charAt(Math.floor(Math.random() * idGenER.length))
  }
  return userID;
}



// Unique URL Generator
function generateRandomString() {
	var rtnAlphaNum = "";
	var inputAlphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i <= 6; i++) {
		rtnAlphaNum += inputAlphaNum.charAt(Math.floor(Math.random() * inputAlphaNum.length))
	}
    return rtnAlphaNum;
}