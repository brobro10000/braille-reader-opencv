const db = require("../config/connection");
const { User } = require("../models");

db.once("open", async () => {
  await User.deleteMany();

  await User.create({
    username: "testuser",
    email: "test@gmail.com",
    password: "testpass",
  });

  console.log("user seeded");

  console.log("all done!");
  process.exit(0);
});
