// for server side handling
// step 1
const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

// step-2
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const serviceId = 'VAa85127e540a2faf087574e91dc939a56';

// constant error messages
const { OTPSent, OTPNotSent, OTPVerified } = require('./shared');

// expose public folder
app.use(express.static('public'));

// body data
app.use(express.json());

// step-1: Create a Verification Service
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// step-2 :  send a verification token
app.post('/send-verification-otp', (req, res) => {
  const { mobileNumber } = req.body;
  client.verify
    .services(serviceId)
    .verifications.create({ to: '+91' + mobileNumber, channel: 'sms' })
    .then((verification) => {
      return res.status(200).json({
        message: OTPSent,
        OTP: verification,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: OTPNotSent,
        error: err,
      });
    });
});

// step 3 : verify the OTP
app.post('/verify-otp', (req, res) => {
  const { mobileNumber, code } = req.body;
  client.verify
    .services(serviceId)
    .verificationChecks.create({ to: '+91' + mobileNumber, code })
    .then((verification_check) => {
      return res.status(200).json({
        message: OTPVerified,
        OTP: verification_check,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        err,
      });
    });
});

// server side server
app.listen(PORT, () => {
  console.log('server in running on port', +PORT);
});
