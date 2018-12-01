const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// BodyParser Middleware
app.use(bodyParser.urlencoded({
  extended: true
}))

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Sign-up Route
app.post('/signup', (req, res) => {
  const {
    firstName,
    lastName,
    email
  } = req.body;

  if (!firstName || !lastName || !email) {
    res.redirect('fail.html')
    return;
  }

// Construct req data
  const data = {
    members:[
      {
        email_address: email,
        status: 'subscribed',
        merge_fields:{
          FNAME: firstName,
          LNAME:lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://<dc>.api.mailchimp.com/3.0/lists/<YOUR_LIST_ID>',
    method: 'POST',
    headers:{
      Authorization: 'auth Add your API key'
    },
    body: postData
  }

  request(options, (err, response, body) => {
    if (err) {
      res.redirect('/fail.html');
    } else {
      if (response.statusCode === 200) {
        res.redirect('/success.html');
      }else {
        res.redirect('/fail.html');
      }
    }
  });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on ${PORT}`));
