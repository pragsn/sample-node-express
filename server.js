const express = require('express');
const axios = require('axios');
const app = express();
const port = 3003
const request = require('request');
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
const {initializeApp , cert} = require('firebase-admin/app');
const { getFirestore }  = require('firebase-admin/firestore');

var serviceAccount = require('./key.json');

const apikey ="532439bf35034f40b0780536232809"

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore();

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.set('view engine', 'ejs');


app.use(express.static('public'));


app.get('/weatherinfo', (req,res)=>{
  if(req.query.location){
    db.collection('weatherhistory')
    .add({
      name: req.query.location
    })
    .then(()=>{
      request("http://api.weatherapi.com/v1/current.json?key=532439bf35034f40b0780536232809&q=" +
     req.query.location +
    "&aqi=no",function(error,response,body){
    const data={
    temp: JSON.parse(body).current.temp_c,
    name :JSON.parse(body).location.name,
    region: JSON.parse(body).location.region,
    last_updated: JSON.parse(body).current.last_updated,
    } 
    res.render('home', {result:data});  
    })

    })
    
  }
  else{
    res.send('location not found!')
  }
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
        res.render('home', {result:null});
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
