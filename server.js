const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
const {initializeApp , cert} = require('firebase-admin/app');
const { getFirestore }  = require('firebase-admin/firestore');


var serviceAccount = require('./key.json');

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.set('view engine', 'ejs');


app.use(express.static('public'));



app.post('/home', async (req, res) => {
  const apiKey = '8d90a3a1da5db908fade0efae0e9773e'; 
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;


  try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric');
      const weatherData = response.data;
    
      res.render('home', {
          location: `Latitude: ${latitude}, Longitude: ${longitude}`,
          temperature: weatherData.main.temp,
          weatherDescription: weatherData.weather[0].description,

      })
  } catch (error) {
      console.error(error);
      res.send('Error fetching weather data.');
  }

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
});

app.get('/signup', (req, res) => {
    res.render('signup')
  })
app.post('/loginsubmit', (req,res) =>{
  const email = req.body.email;
  const password = req.body.password;
  //passwordHash.verify('password',)
  db.collection('users')
    .where('email', "==" ,email)
    
    .get()
    .then((docs)=>{
      let verified = false;

      docs.forEach(doc=>{
        verified = passwordHash.verify(password,doc.data().password);
        console.log(doc.id, "=>" , doc.data());
      })
      console.log(docs);
      if(verified){
        res.render('home');
      }
      else{
        res.send("login failed");
      }

       //if(docs.size>0){
        //res.render('home')
      // }
      //else{
        //res.send("login failed");
      //}
      
    });
});
  app.post('/signupsubmit', (req, res) => {
    
    console.log(req.body);
  
    const fullname = req.body.fullname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    
  db.collection("users")
  .where("email" ,"==",email)

  .get()
  .then((docs)=>{
    if (docs.size>0){
      res.send("account already exists!")
    }
    else{
      db.collection('users').add({
        name: fullname + lastname,
        email: email,
        password:passwordHash.generate(password),
      })
      .then(()=>{
        res.render('login')
      });
      
    }

  })
  });

  app.get('/login', (req, res) => {
    res.render('login')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
