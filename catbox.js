const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function uploadToCatbox(filePath) {
  const endpoint = "https://catbox.moe/user/api.php";

  const form = new FormData();
  form.append("reqtype", "fileupload");
  form.append("userhash", "");
  form.append("fileToUpload", fs.createReadStream(filePath));

  const res = await axios.post(endpoint, form, {
    headers: form.getHeaders(),
  });

  return res.data;
}

module.exports = uploadToCatbox;
