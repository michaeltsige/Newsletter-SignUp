const express =  require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const { response } = require('express');

const app = express ()
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html" );
});

app.post("/", (req, res) => {
    

    const url = "https://us21.api.mailchimp.com/3.0/lists/13d0310d91"

    const {fName, lName, email} = req.body;
    
    const data = {
        members: [
        {
            email_address: email,
            status:"subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName
            }
        }]
    }

    const jsonData = JSON.stringify(data);
    

    options = {
        method: "POST",
        auth: "Michael:2db5008c8e5921644bd6ad7b7e288615-us21"
    }

    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200)
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/failure.html");

        response.on('data', (data) => {
            const dataObj = (JSON.parse(data));
            console.log(dataObj);
            // console.log(dataObj.error_count)
            // if(dataObj.error_count > 0)
            //     response.sendFile(__dirname + "/failure.html");
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure",(req,res) => {
    res.redirect("/");
})


port =  process.env.PORT || 3000;
app.listen(port,() => {
    console.log("Server is running");
});

//list id
//13d0310d91

//api key
//2db5008c8e5921644bd6ad7b7e288615-us21