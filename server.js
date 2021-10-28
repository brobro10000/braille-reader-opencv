const express = require("express");
const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


// routes
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});