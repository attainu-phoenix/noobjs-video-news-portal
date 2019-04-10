"use strict";

const express = require("express");

const bodyParser = require("body-parser");

const mongo = require("mongodb");

const app = express();

const Admin = require("./routes/Admin/admin")

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));

app.use("/admin",Admin);












app.listen(3000);