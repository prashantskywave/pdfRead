// pages/api/pdf-extract.js
const fs = require('fs');
// const fetch = require('node-fetch');
const tabula = require("tabula-js");
export async function POST(req) {
  const { buffer, originalname } = req.file;

  try {
    const tmpFilePath = join(tmpdir(), originalname);
    await fs.writeFile(tmpFilePath, buffer);

    const t = tabula(tmpFilePath);

    t.extractCsv((err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error extracting CSV" });
      } else {
        console.log(data);
        res.json({ success: true, data });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
