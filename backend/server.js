const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());

app.get('/api/vehicle-data', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data');
    }
    res.json(JSON.parse(data));
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
