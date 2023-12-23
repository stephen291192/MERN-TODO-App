// Install necessary packages: express, mongoose, cors
// npm install express mongoose cors

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Database Connection - Start ----
mongoose
  .connect(
    "mongodb+srv://stephen291192:uYRda40vYrIp7VM4@cluster0.ccladre.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch(console.error);

let database = mongoose.connection;
module.exports = database;
database.once("open", () => {
  console.log("Database Connected Succesfully...");
});

database.on("error", (error) => {
  console.log(error, "Database Not Connected");
});

// Database Connection - End ----

const Task = mongoose.model("Task", { title: String });

// Save API function
app.post("/api/tasksCreate", async (req, res) => {
  const { title } = req.body;
  try {
    const newTask = new Task({ title, completed: false });
    await newTask.save();
    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Update API Function
app.put("/api/tasksUpdate/:id", async (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { completed },
      { new: true }
    );
    res.json({ task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Get All Data API Function
app.get("/api/tasksGet", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Delect API Function
app.delete("/api/tasksdelete/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndDelete(taskId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).send("Internal Server Error");
  }
});

// API route for fetching tasks with server-side pagination
app.get("/api/tasks", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Convert page to an integer, default to 1
    const perPage = 5; // Adjust as needed

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / perPage);

    if (page < 1 || page > totalPages) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const tasks = await Task.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    res.json({ tasks, totalPages, currentPage: page });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
