import express from "express";
import https from "https";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";

const app = express();
const port = 3001;
import { SendEmail } from "./emailService.js";

const httpsSever = https.createServer(
  // Provide the private and public key to the server by reading each
  // file's content with the readFileSync() method.
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

httpsSever.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// app.get("/", (req, res) => {
//   res.send(
//     '<form method="post" enctype="multipart/form-data">' +
//       '<p>Recipient: <input type="text" name="recipient"/></p>' +
//       '<p>Subject: <input type="text" name="subject"/></p>' +
//       '<p>Message: <input type="text" name="message"/></p>' +
//       '<p>Image: <input type="file" name="image" accept=".png,.jpg,.jpeg" multiple/></p>"' +
//       '<p><input type="submit" value="Upload"/></p>' +
//       "</form>"
//   );
// });

const upload = multer({
  dest: "./temp",
});

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Connected" });
});

app.post(
  "/",
  upload.array("image" /* name attribute of <file> element in your form */),
  (req, res) => {
    // const arrOfName = [];
    // for (let i = 0; i < req.files?.length; i++) {
    //   uploadImage(req, res, i, arrOfName);
    // }

    // let attachments = [];
    // arrOfName.forEach((value) => {
    //   attachments.push({ path: value });
    // });
    let data = req.body;
    console.log(req.body);

    SendEmail(
      "seanyousefi5@gmail.com",
      "New Job",
      `Client name: ${data.firstName} ${data.lastName} \n 
        Client address: ${data.address} \n
        Client zip: ${data.zipCode} \n
        Client phone number: ${data.phoneNumber} \n
        Client email: ${data.email} \n
        Expected completion date: ______ \n
        Job type: ${data.service} \n
        additional info: ${data.additionalInfo} \n
        Out Reach type: ${data.outReachType}`
      //attachments
    );
    if (res.statusCode == 200) {
      console.log("success");
      res.status(200).json({ success: true });
    }
    // res.status(200).contentType("text/plain").end("File uploaded!");
  }
);

function uploadImage(req, res, num, arrayOfNames) {
  //get the path temp of the file uploaded from the form
  const tempPath = req.files[num].path;
  // get the extension of the uploaded file
  const extension = path.extname(req.files[num].originalname).toLowerCase();
  //make sure extension is an image format
  if (extension === ".png" || extension === ".jpg" || extension === ".jpeg") {
    //create file path for the uploaded file
    const targetPath = path.join(
      __dirname,
      `/temp/${req.body.recipient}-image-${num}${extension}`
    );
    arrayOfNames.push(targetPath);
    // rename file to the target path/file name
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.log(err.message);
        return;
      }

      console.log("uploaded image successfully");
    });
  } else {
    // if non image is uploaded.
    fs.unlink(tempPath, (err) => {
      if (err) {
        console.log(err.message);
        return;
      }

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    });
  }
}
