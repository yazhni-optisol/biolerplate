const Speakeasy = require('speakeasy');

exports.otpCode = (next) => {
  const secret = Speakeasy.generateSecret({ length: 20 });
  const otpCode = Speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    step: 60,
    window: 10,
  });
  next({ secret: secret.base32, otpCode });
};
// set otp expiration for 10 minutes, can adjust by increase or decrease window
// new otp for every 60 seconds, can adjust by increasing or decreasing the step
exports.verifyOTP = (params, next) => {
  try {
    const { secret, otpCode } = params;
    const isValid = Speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otpCode,
      step: 60,
      window: 10,
    });
    next(isValid, null);
  } catch (error) {
    next(null, error);
  }
};
