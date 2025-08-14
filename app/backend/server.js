const express = require("express");
const cors = require("cors");
const connectDB = require("./dbConnection");
require("dotenv").config();//Load the .env file
const swStats = require("swagger-stats"); //THIS IS NECESSARY FOR PROMETHEUS



const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/tasksRoutes");


const app = express();
connectDB().then(client => {
    const db = client.db("TODODB"); //Creates the database if it does not exist, and the same with the collection
    app.locals.db = db;  // Attach db to app locals so routes can access it


    app.use(cors(
        //{origin: 'http://localhost:3000',  // Replace with your frontend URL
        //methods: ['GET', 'POST', 'PUT', 'DELETE'],}
    ));
    app.use(express.json());

    //this creates a route /swagger-stats/metrics where exposes all the metrics required by Prometheus
    app.use(swStats.getMiddleware());
    
    app.use("/auth", authRoutes);
    app.use("/tasks", todoRoutes);
    app.get("/", (req, res) => {
        res.send("Hello World");
    })

    app.listen(3500, () => console.log("Server running on port 3500"));

}

).catch(console.error);


