//  client side server handling
const baseURL = `http://localhost:3000/`;
const loginForm = document.getElementById('login-form');
const codeInput = document.getElementById('codeInput');
let mobileNumber;
let isOTPDelivered = false;

// login form 
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  mobileNumber = parseInt(document.getElementById('phoneInput').value);
  if (isNaN(mobileNumber)) {
    alert('Invalid mobile number');
  } else {
    if (isOTPDelivered) {
      const code = codeInput.value;
      const response = await verifyOTP(mobileNumber, code);
      alert(response.status);
      return;
    }
    const response = await sendVerificationCode(mobileNumber);
    console.log("otp sent ",response)
    if (response.status === 'pending') {
      codeInput.parentElement.classList.remove('hidden');
      isOTPDelivered = true;
    }
  }
});

//  send verificaton code
async function sendVerificationCode() {
  const res = await axios.post(baseURL + `send-verification-otp`, {
    mobileNumber,
  });
  console.log("res data", res);
  if (res.status === 200) {
    return res.data.verification;
  } else {
    return res.data;
  }
}

// verify OTP
async function verifyOTP() {
  const res = await axios.post(baseURL + `verify-otp`, {
    mobileNumber,
    code,
  });
  if (res.status === 200) {
    return res.data.verification_check;
  } else {
    return res.data;
  }
}
