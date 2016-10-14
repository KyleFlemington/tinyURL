var express = require("express");
var app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
var PORT = process.env.PORT || 8080; // default port 8080

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "zu7cwx": "http://www.drugsandmirrors.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.end("Welcome to my Tiny App. We are going to fuck with URLS!");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls : urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, actualURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {  
	console.log(req.body);
	const longURL = req.body.longURL
	const shortURL = generateRandomString()
	urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});


app.post("/urls/:shortURL/delete" , (req, res) => {
	delete urlDatabase[req.params.shortURL]
	console.log("Deleted URL")
	res.redirect("/urls");
});


app.post("/urls/:shortURL/update"  , (req, res)  => {
	const theNewURL = (req.body.longURL)
	console.log(theNewURL);
	const theOldURL = ** urlDatabase[req.params.id] **
	console.log(theOldURL) //Undefined 
	// REPLACE WTFUUUUUUU  
	res.redirect("/urls");
});

/// Adding the new URL NOT updating


function generateRandomString() {
	var rtnAlphaNum = "";
	var inputAlphaNum = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i <= 6; i++) {
		rtnAlphaNum += inputAlphaNum.charAt(Math.floor(Math.random() * inputAlphaNum.length))
	}
    return rtnAlphaNum;
}




