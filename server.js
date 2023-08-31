const express = require('express')
const app = express()
const port = 3003

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello there i am prajna')
})

app.get('/signup', (req, res) => {
    res.render('signup')
  })

  app.get('/signin', (req, res) => {
    res.send('Hello there i am in signin page')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})