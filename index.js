// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import moviesRouter from "./routes/movies.route.js";

dotenv.config()
const app = express();

const PORT = process.env.PORT;

// Connection
// const MONGO_URL = "mongodb://127.0.0.1";
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL);
await client.connect(); // top level await 
console.log("Mongo is connected !!!");

app.use(express.json());

app.get("/", function (request, response) {
    response.send(`Hello World !!!`);
});

app.use("/movies", moviesRouter)

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));

export {client}