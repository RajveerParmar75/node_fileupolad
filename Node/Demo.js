const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer(); // Initialize multer without any storage options
const port = process.env.PORT || 8000;
const path = "./image/";

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/download", (req, res) => {
  const user_id = req.query.id;
  const filename = req.query.filename;

  if (user_id && filename) {
    const filePath = path + user_id + "/" + filename;

    if (fs.existsSync(filePath)) {
      res.download(filePath, filename, (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).send("Error downloading file");
        }
      });
    } else {
      res.status(404).send("File not found");
    }
  } else {
    res.status(400).send("User ID and filename are required");
  }
});
app.post("/uploadfile", upload.single("files"), (req, res) => {
  const user_id = req.query.id;
  const file = req.file; // Use req.file to access the uploaded file
  console.log(user_id, file);

  if (user_id && file) {
    const targetFolderPath = path + user_id + "/";

    if (!fs.existsSync(targetFolderPath)) {
      fs.mkdirSync(targetFolderPath, { recursive: true });
    }

    fs.writeFile(targetFolderPath + file.originalname, file.buffer, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        res.status(500).send("Error writing to file");
      } else {
        console.log("Content written to file successfully");
        res.send("File uploaded and saved successfully");
      }
    });
  } else {
    res.status(400).send("User ID and a file are required");
  }
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
