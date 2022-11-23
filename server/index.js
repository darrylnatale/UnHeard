const express = require('express')

const port = 8000

//chained method (express.get, express.listen, etc - instead of app = express() and app.get)
express()

.get('/hello', (req, res) => {
  res.status(200).json({status: 200, message: "Hello World"})
})

.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})