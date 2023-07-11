// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { request, STATUS_CODES } = require("http");
// const { request }= require("request");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {
  const fName = req.body.nam1;
  const lName = req.body.name2;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data)
  const url = "https://us21.api.mailchimp.com/3.0/lists/a328367a6f";
  const options = {
    method: "POST",
    auth: "stephen:f2b24ae1aed0e35a0a2d3742c342c650-us21"
  }
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data))
    })
  })
  request.write(jsonData);
  request.end();

  // console.log(fName, lName, email)
})

app.post("/failure", (req, resp)=> {
  resp.redirect("/")
})

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on 3000 port");
})

// API Key
// f2b24ae1aed0e35a0a2d3742c342c650-us21
// audience id
// a328367a6f
