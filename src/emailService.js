import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "Jobs_in_a_jiffy_123@outlook.com",
    pass: "hehexd@720420",
  },
});

export function SendEmail(_recipient, _subject, _message, _attachments) {
  const options = {
    from: "Jobs_in_a_jiffy_123@outlook.com",
    to: "seanyousefi5@gmail.com",
    subject: _subject,
    text: _message,
    //attachments: _attachments,
  };

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(info.response);
  });
}
