import { FromAdminMail, GMAIL_PASSWORD, GMAIL_USER, userSubject } from "../config/index";
import nodemailer from "nodemailer";



const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER, // generated ethereal user
    pass: GMAIL_PASSWORD, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});
// console.log(GMAIL_USER, GMAIL_PASSWORD, FromAdminMail );


export const mailSent = async (
  from: string, //'"Fred Foo 👻" <foo@example.com>', // sender address
  to: string, //"bar@example.com, baz@example.com", // list of receivers
  subject: string, //"Hello ✔", // Subject line
    html: string//"<b>Hello world?</b>", // html body
) => {
  try {
    const response = await transport.sendMail({
      from: FromAdminMail,
      to,
      subject: userSubject,
      html
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};