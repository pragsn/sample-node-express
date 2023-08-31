const express = require('express')
const app = express()
const port = 3003

app.get('/', (req, res) => {
  res.send('Hello there i am prajna')
})

app.get('/hello', (req, res) => {
    res.send('Hello there i am prajna')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})