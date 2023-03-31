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
    // const { id } = request.params;
    const id = new ObjectId(request.params.id);
    const movie = await client.db("movieapp").collection("movies").findOne({ _id: id })
    //const movie = movies.find((mv) => mv.id === id);
    console.log(movie);
    movie ? response.send(movie) : response.status(404).send({ message: "movie not found" })
});

router.post("/", async function (request, response) {
    try {
        const data = request.body;
        console.log("data", data);
        const result = await client
            .db("movieapp")
            .collection("movies")
            .insertOne(data);
        response.json(result);
    } catch (error) {
        console.log(error);
        return response.json(error.message)
    }

});

router.delete("/:id", async function (request, response) {
    // const { id } = request.params;
    const id = new ObjectId(request.params.id);
    const result = await client
        .db("movieapp")
        .collection("movies")
        .deleteOne({ _id: id });

    result.deletedCount > 0
        ? response.send({ message: "movie deleted successfully" })
        : response.status(404).send({ message: "movie not found" });
})

router.put("/:id", async function (request, response) {
    try {
        // const { id } = request.params;
        const id = new ObjectId(request.params.id);
        const data = request.body;
        const result = await client
            .db("movieapp")
            .collection("movies")
            .updateOne({ _id: id }, { $set: data });
        response.json(result);
    } catch (error){
        console.log(error);
        return response.json(error.message)
    }
    
});

export default router;