"use strict";

const express = require("express");
const { User } = require("../../models");
const sendMail = require("../../config/nodemailer");

const api = express.Router();

api.get("/", async (req, res) => {
  res.send("Mail sent!");
});

api.post("/register", async (req, res) => {
  const displayName = req.body.displayName;
  const email = req.body.email;
  const password = req.body.password;
  const newUser = await User.register({ displayName, email, password });
  res.send(newUser);
});

module.exports = api;
