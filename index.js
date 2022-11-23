var Sib = require('sib-api-v3-sdk');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Message = require('./model');
const nodemailer = require("nodemailer");

const cors = require('cors')
// INIT
const app = express();
app.use(express.json());
dotenv.config({ path: './.env' });


// DB
const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));




app.use(express.json({ limit : '10kb' }));
app.use(cors({
    origin: ['https://www.dfwsolarreport.org']
  }))
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.dfwsolarreport.org');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'X-HTTP-Method-Override', 'X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });



// ROUTES
app.get('/messages', async (req, res) => {
    try{
        const messages = await Message.find()

        return res.status(200).json({
            status: 'succes',
            data: messages
        })
    }catch(err){
        return res.status(400).json({
            status: 'error',
            err
        })
    }
})

app.post('/message', async (req,res) => {
    const {homeStatus, adress, electricBill, electricCompany, creditScore, name, phone, email} = req.body
  try{
      const message = await Message.create({homeStatus, adress, electricBill, electricCompany, creditScore, name, phone, email})
      return res.status(201).json({
          status: 'success',
          data : message
      })
  }catch(err){
      return res.status(400).json({
          status: 'error',
          err
      })
  }
})


// app.post('/send', async (req, res) => {
//     const {homeStatus, adress, electricBill, electricCompany, creditScore, name, phone, email, date, hour} = req.body
//     try{
//         const client = Sib.ApiClient.instance;
//         const apiKey = client.authentications['api-key'];
//         apiKey.apiKey = process.env.SMTP_KEY;
//         const tranEmailApi = new Sib.TransactionalEmailsApi()
//         const sender = {
//             email: email
//         }
//         const receiver = [
//             {
//                 email: 'saadirania406@gmail.com',
//             }
//         ]
//         tranEmailApi.sendTransacEmail({
//             sender,
//             to: receiver,
//             subject:`Message from ${name}`,
//             htmlContent: `<html><head></head><body><p>name: ${name}</p><p>phone: ${phone}</p><p>email: ${email}</p><p>Do you own your home? :${homeStatus}</p><p>Street address :${adress}</p><p>Average electric bill  :${electricBill}</p><p>current electric company  :${electricCompany}</p><p>Do you have a credit score of 600 or higher :${creditScore}</p><p>Slected Date and Hour :${date} at ${hour}</p></body></html>`
//         }).then(console.log).catch(console.log)

//         return res.status(201).json({
//             status: 'success',
//             message: 'message sent succussfully!'
//         })
//     }catch(err){
//         return res.status(400).json({
//             status: 'error',
//             err
//         })
//     }
// })

app.post('/send', async (req, res) => {
    const {homeStatus, adress, electricBill, electricCompany, creditScore, name, phone, email, date, hour} = req.body
    try{
        let transporter = nodemailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: "587",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });
        
        
        const mailOptions = {
            from: email,
            to: 'DFWSolarReport@gmail.com',
            subject: "From website",
            text:`<html><head></head><body><p>name: ${name}</p><p>phone: ${phone}</p><p>email: ${email}</p><p>Do you own your home? :${homeStatus}</p><p>Street address :${adress}</p><p>Average electric bill  :${electricBill}</p><p>current electric company  :${electricCompany}</p><p>Do you have a credit score of 600 or higher :${creditScore}</p><p>Slected Date and Hour :${date} at ${hour}</p></body></html>`
        };
        await transporter.sendMail(mailOptions);
       

        return res.status(201).json({
            status: 'success',
            message: 'message sent succussfully!'
        })
    }catch(err){
        return res.status(400).json({
            status: 'error',
            err
        })
    }
})
// RUN THE SERVER
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`server running on ${port}.....`))

process.on('SIGTERM', () => {
  console.log('SIGTERM recieved');
  server.close(() => {
    console.log('Process terminated')
  })
})

module.exports = app;