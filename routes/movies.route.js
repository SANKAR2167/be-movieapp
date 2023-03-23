import express from "express";
import { client } from "../index.js";
import { auth } from "../middleware/auth.js";
import { ObjectId } from "mongodb";

const router = express.Router()

router.get("/", async function (request, response) {

    if (request.query.rating) {
        request.query.rating = +request.query.rating;
    }

    const movie = await client
        .db("movieapp")
        .collection("movies")
        .find(request.query)
        .toArray();
    response.send(movie);
});

router.get("/:id", async function (request, response) {
    const { id } = request.params;
    const movie = await client.db("movieapp").collection("movies").findOne({ _id: ObjectId(id) })
    //const movie = movies.find((mv) => mv.id === id);
    console.log(movie);
    movie ? response.send(movie) : response.status(404).send({ message: "movie not found" })
});

router.post("/", async function (request, response) {
    const data = request.body;
    console.log(data);
    const result = await client
        .db("movieapp")
        .collection("movies")
        .insertMany(data);
    response.send(result);
});

router.delete("/:id", async function (request, response) {
    const { id } = request.params;
    const result = await client
        .db("movieapp")
        .collection("movies")
        .deleteOne({ id: id });

    result.deletedCount > 0
        ? response.send({ message: "movie deleted successfully" })
        : response.status(404).send({ message: "movie not found" });
})

router.put("/:id",auth, async function (request, response) {
    const { id } = use.params;
    const data = request.body;

    const result = await client
        .db("movieapp")
        .collection("movies")
        .updateOne({ id: id }, { $set: data });

    console.log(result);
    response.send(result);
});

export default router;