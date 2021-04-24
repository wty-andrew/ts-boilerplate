import path from 'path'
import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer'
import { Address } from 'nodemailer/lib/mailer'
import queryString from 'query-string'

import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  BASE_URL,
} from '../config'

// changed these urls according to your frontend application
const ACCOUNT_ACTIVATION_URL = path.join(BASE_URL, 'account/activation')
const RESEND_ACTIVATION_URL = path.join(BASE_URL, 'account/resend-activation')
const PASSWORD_RESET_URL = path.join(BASE_URL, 'account/reset-password')
const FORGOT_PASSWORD_URL = path.join(BASE_URL, 'account/forgot-password')

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
})

export const verifySMTPConfig = (): Promise<boolean> => {
  return transporter.verify()
}

export const sendEmail = (
  to: SendMailOptions['to'],
  subject: string,
  message: string
): Promise<SentMessageInfo> => {
  const mail: SendMailOptions = {
    from: SMTP_USERNAME,
    to,
    subject,
    text: message,
  }
  return transporter.sendMail(mail)
}

export const sendConfirmationEmail = async (
  recipient: Address,
  token: string
): Promise<SentMessageInfo> => {
  const subject = 'Email verification'
  const activationLink = queryString.stringifyUrl({
    url: ACCOUNT_ACTIVATION_URL,
    query: { email: recipient.address, token },
  })
  const message = `\
Hi ${recipient.name},

Your user account has been created.
Please use the following link to activate your account:

${activationLink}

This link will expire in 20 minutes.
You can request another here: ${RESEND_ACTIVATION_URL}`

  return sendEmail(recipient, subject, message)
}

export const sendForgotPasswordEmail = async (
  recipient: Address,
  token: string
): Promise<SentMessageInfo> => {
  const subject = 'Password reset instructions'
  const passwordResetLink = queryString.stringifyUrl({
    url: PASSWORD_RESET_URL,
    query: { email: recipient.address, token },
  })
  const message = `\
Hi ${recipient.name},

Please use the link below to reset your password:

${passwordResetLink}

This link will expire in 20 minutes.
You can request another here: ${FORGOT_PASSWORD_URL}`

  return sendEmail(recipient, subject, message)
}

export const sendPasswordResetEmail = async (
  recipient: Address
): Promise<SentMessageInfo> => {
  const subject = 'Password reset successfully'
  const message = `\
Hi ${recipient.name},

Your password has been successfully updated, you can now login with your new password.`

  return sendEmail(recipient, subject, message)
}
