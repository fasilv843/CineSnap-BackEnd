
export function getOTPTemplate (otp: number): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>One-Time Password (OTP)</title>
    </head>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center;">One-Time Password (OTP) for Verification</h2>
        <p>Dear User,</p>
        <p>Your one-time password (OTP) for verification is:</p>
        <h1 style="text-align: center; font-size: 36px; padding: 20px; background-color: #f2f2f2; border-radius: 5px;">${otp}</h1>
        <p>Please use this OTP to complete your verification process.</p>
        <p>This OTP is valid for a single use and will expire after a short period of time.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Thank you,</p>
        <p>CineSnap</p>
    </body>
    </html>
    `
}