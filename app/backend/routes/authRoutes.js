const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();


router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.locals.db;//access to the local shared db
    const usersCollection = db.collection("users");
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    try {
      const user = await usersCollection.findOne({ username });
      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await usersCollection.insertOne({ username, password: hashedPassword });
      console.log("key:", process.env.MONGO_SECRET_KEY);
      const token = jwt.sign({ userId: result.insertedId }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log("token:", token)
      res.status(201).json({ token, user: { username } });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to register user" });
    }
  }
  );

  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const db = req.app.locals.db;//access to the local shared db
    const usersCollection = db.collection("users");
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    try{
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
    
    } catch (error) {
      res.status(500).json({ error: "Failed login" });
    }
  }
  );

  //Not accesible fot the client, but for me for checking purposes
  router.get("/users", async (req, res) => {
    const db = req.app.locals.db;//access to the local shared db
    const usersCollection = db.collection("users");
    try {
      const users = await usersCollection.find().toArray();
      console.log("Users retrieved:", users);
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error retrieving users" });
    }
  });

  module.exports = router;