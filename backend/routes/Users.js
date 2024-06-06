const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const {validateToken} = require("../middlewares/Authmiddlewares")
const {sign} = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("SUCCESS");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "User Doesn't Exist" });

  bcrypt.compare(password, user.password).then(async(match) => {
    if (!match) res.json({ error: "Wrong Username And Password Combination" });

    //generate token
    const accessToken = sign(
      {username: user.username, id: user.id},
      "importantsecret"
    );
    res.json(accessToken);
  });
});

//check to see if we are authenticated
router.get('/auth', validateToken, (req,res) => {
   return res.json(req.user)
})

module.exports = router;
