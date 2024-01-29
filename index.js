const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

console.log("Tenis backend api started");

const uri = process.env.MONGO_URI || "mongodb+srv://joserodrigolopez:xK22YDi1adZJdw25@mongodbdeployed.nr8iyxd.mongodb.net/tenis_back";

connection(uri);

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./routes/userRoutes");
app.use("/api/users", UserRoutes);
const ClassRoutes = require("./routes/classRoutes");
app.use("/api/classes", ClassRoutes);

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "id": 1,
        "name": "Jose Lopez",
        "version": "1.0.0"
    });
});

app.listen(port, () => {
    console.log("Node server running in port:", port); 
});