// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config()
const app = express();

const PORT = 4000;

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

app.get("/movies", async function (request, response) {

    if (request.query.rating){
        request.query.rating = +request.query.rating;
    }

    const movie = await client
        .db("movieapp")
        .collection("movies")
        .find(request.query)
        .toArray();
    response.send(movie);
});

app.get("/movies/:id", async function (request, response) {
    const { id } = request.params;
    const movie = await client.db("movieapp").collection("movies").findOne({ id: id })
    //const movie = movies.find((mv) => mv.id === id);
    console.log(movie);
    movie ? response.send(movie) : response.status(404).send({ message: "movie not found" })
});

app.post("/movies", async function (request, response) {
    const data = request.body;
    console.log(data);
    const result = await client
    .db("movieapp")
    .collection("movies")
    .insertMany(data);
    response.send(result);
});

app.delete("/movies/:id", async function (request, response){
    const { id } = request.params;
    const result = await client
    .db("movieapp")
    .collection("movies")
    .deleteOne({id : id});

    result.deletedCount > 0 
    ? response.send({ message: "movie deleted successfully"})
    : response.status(404).send({message: "movie not found"});
})


app.put("/movies/:id", async function (request, response) {
    const {id} = use.params;
    const data = request.body;

    const result = await client
    .db("movieapp")
    .collection("movies")
    .updateOne({id : id}, {$set: data});

    console.log(result);
    response.send(result);
});
app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
