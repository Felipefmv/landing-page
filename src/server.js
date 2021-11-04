const nodemailer = require('nodemailer')
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

require('dotenv').config()

app.use(
  bodyParser.urlencoded({
    limit: '5000mb',
    extended: true,
    parameterLimit: 100000000000
  })
)

app.use(express.json())
app.use(express.static(__dirname))

const transport = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.PORT,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  },
  tls: {
    rejectUnauthorized: false
  }
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/', function (req, res) {
  const name = req.body.name
  const email = req.body.email
  const message = req.body.message

  sendEmail(name, email, message)
  res.send('POST request to the homepage')
})

console.log('Server started at http://localhost:' + port)
app.listen(port)

async function sendEmail(name, email, message) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.HOST,
      port: process.env.PORT,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })
    const mailSent = await transport.sendMail({
      text: 'Agradecemos pelo contato em breve retornaremos a sua mensagem!',
      subject: 'Email recebido!',
      from: 'Felipe Fernandes felipefernandesteste@gmail.com',
      to: [email]
    })

    const mailVerification = await transport.sendMail({
      text: message,
      subject: `Contato de ${name}`,
      from: email,
      to: ['felipefernandesteste@gmail.com']
    })
  } catch (err) {
    console.error(err)
  }
}
