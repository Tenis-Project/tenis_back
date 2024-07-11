const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');

console.log("Tenis backend api started");

const uri = process.env.MONGO_URI;

connection(uri);

const app = express();

const port = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const UserRoutes = require("./routes/userRoutes");
app.use("/api/users", UserRoutes);
const ClassRoutes = require("./routes/classRoutes");
app.use("/api/classes", ClassRoutes);
const ReservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", ReservationRoutes);
const ClassPackageRoutes = require("./routes/classPackagesRoutes");
app.use("/api/classPackages", ClassPackageRoutes);
const DeleteAccountRequestRoutes = require("./routes/deleteAccountRequestRoutes");
app.use("/api/deleteAccountRequest", DeleteAccountRequestRoutes);

app.get("/test-route", (_req, res) => {
    return res.status(200).json({
        "version": "1.5.4"
    });
});

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:4200'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const requests = require('./socket-requests/requests');
requests(io);

server.listen(port, () => {
    console.log("Node server running in port:", port); 
});