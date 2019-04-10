"use strict";

const express = require("express");

const bodyParser = require("body-parser");

const mongo = require("mongodb");

const app = express();

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(express.static("public"));












app.listen(3000);