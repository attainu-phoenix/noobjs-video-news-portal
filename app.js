"use strict";

const express = require("express");

const bodyParser = require("body-parser");

const mongo = require("mongodb");

const Admin = require("./routes/Admin/admin")

const User = require("./routes/User/user");

const app = express();

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/admin",Admin);

app.use("/user", User);













app.listen(3000);