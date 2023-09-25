const express = require('express')
const app = express()
const port = 3003

const {initializeApp , cert} = require('firebase-admin/app');
const { getFirestore }  = require('firebase-admin/firestore');


var serviceAccount = require('./key.json');

initializeApp({
  credential: cert(serviceAccount),
})

const db = getFirestore();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello there i am prajna')
})

app.get('/signup', (req, res) => {
    res.render('signup')
  })
app.get('/loginsubmit', (req,res) =>{
  const email = req.query.email;
  const password = req.query.password;

  db.collection('users')
    .where('email', "==" ,email)
    .where('password', "==" , password)
    .get()
    .then((docs) => {
      if (docs.size>0){
        var usersData=[];
        db.collection('users').get().then(()=>{
          docs.forEach((doc)=>{
           usersData.push(doc.data());
          });
        })
        .then(()=>{
        console.log(usersData);
        res.render('home', {usersData: usersData})
        })
      }
      else{
        res.send("login failed");
      }
      
    });
});
  app.get('/signupsubmit', (req, res) => {
  
    const fullname = req.query.fullname;
    const lastname = req.query.lastname;
    const email = req.query.email;
    const password = req.query.password;


  db.collection('users').add({
    name: fullname + lastname,
    email: email,
    password: password,
  }).then(()=>{
    res.render('login')
  });

  });

  app.get('/login', (req, res) => {
    res.render('login')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})