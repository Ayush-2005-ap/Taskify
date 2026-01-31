const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// Create
router.post("/", auth, async (req, res) => {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      deadline: req.body.deadline,
      userId: req.user.id
    });
    res.json(task);
  });

// Read
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Update
router.put("/:id", auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(task);
});

router.patch("/:id/toggle", auth, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
  
    task.status = task.status === "Pending" ? "Completed" : "Pending";
    await task.save();
  
    res.json(task);
  });

// Delete
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.json({ msg: "Deleted" });
});

module.exports = router;
