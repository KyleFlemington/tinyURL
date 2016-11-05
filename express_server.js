"use strict"
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');


const app = express();
const PORT = process.env.PORT || 8080; // default port 8080


var users = {
};

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "zu7cwx": "http://www.drugsandmirrors.com"
};


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.listen(PORT, () => {
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


//Home Page
app.get("/", (req, res) => {
  //If user not logged into respond with 401 
  //If user is logged in redirect to /urls  
  res.render("urls_home")
});


app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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

  for (userID in users) {
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
    email: req.body["email"],
    urls: {},
  };

  //Once Registered user should be logged in

  //Once registered Login should not display 

  req.cookies["user_id"] = newUserID;
  res.redirect("/urls")
});

//Login Page
app.get("/login", (req, res) => {
res.render("urls_login")
});

app.post("/login" , (req, res) => {
  var user = null;
  for (userID in users) {
    if (users[userID].email === req.body.email) {
      user = users[userID];
    }
  }
  if (!user) {
    res.status(403);
    return res.send("User Cannot Be Found");
  }
  if (user.password !== req.body.password) {
    res.status(403);
    return res.send("Wrong Password");
}
  if (user) {
    res.status(400);
  }

//Once logged in register should not appear

  res.cookie("user", user) 
  res.redirect("/urls")
});



// User Cannot Access Main Index without Reg/Logi === cookies
app.use((req, res, next) => {

  if(!req.signedCookies.username) {

    //res.redirect("/login")

    res.status(401).send('<h1>Not Auth! Please Login<h1><a href="/login"> Here! </a>');

    return;

  }

  next();

});


//Main Index
app.post("/urls", (req, res) => {  
  const shortURL = generateRandomString()
  const longURL = req.body.longURL
  const userID = /**/
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/urls", (req, res) => {
  let templateVars2 = { 
    urls : urlDatabase,
    username: req.cookies["user"] && req.cookies["user"]["username"], 
  };
  res.render("urls_index", templateVars2);
});



//User specific
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});




//Logout
app.post("/logout", (req, res) => {
  res.cookie("user", null);  
  res.redirect("/urls")
});



//Submit New
app.get("/urls/new", (req, res) => {
	let templateVars = {
		username: req.cookies["username"]
	}
  res.render("urls_new", templateVars);
});


//Unique ID Webpage
app.get("/urls/:id", (req, res) => {
  let templateVars = { 
  	shortURL: req.params.id, 
  	actualURL: urlDatabase[req.params.id],
  	username: req.cookies["username"],
  };
  res.render("urls_show", templateVars);
});



//Delete
app.post("/urls/:shortURL/delete" , (req, res) => {
	delete urlDatabase[req.params.shortURL]
	res.redirect("/urls");
});


//Update
app.post("/urls/:shortURL/update"  , (req, res)  => {
	const theNewURL = (req.body.longURL)
	const theOldURL =  urlDatabase[req.params.shortURL]
	urlDatabase[req.params.shortURL] = theNewURL
	res.redirect("/urls");
});


// Unique URL Generator
function generateRandomString() {
	var rtnAlphaNum = "";
	var inputAlphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i <= 6; i++) {
		rtnAlphaNum += inputAlphaNum.charAt(Math.floor(Math.random() * inputAlphaNum.length))
	}
    return rtnAlphaNum;
}