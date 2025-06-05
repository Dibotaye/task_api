const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'tasks.json');

app.use(express.json());

// Load tasks from JSON file or start with empty array
let tasks = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    tasks = JSON.parse(data);
  }
} catch (err) {
  console.error('Error reading tasks file:', err);
}

// Helper to save tasks to JSON file
function saveTasks() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// Home route: simple API is running message
app.get('/', (req, res) => {
  res.send(`
    <h1>Task API</h1>
    <p>The API is running. Use the <code>/api/tasks</code> endpoints to manage tasks.</p>
  `);
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST add new task
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Task title is required and must be a string.' });
  }
  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

// PUT mark task as completed
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  task.completed = true;
  saveTasks();
  res.json(task);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  const deletedTask = tasks.splice(index, 1)[0];
  saveTasks();
  res.json(deletedTask);
});

// Start server
app.listen(PORT, () => {
  console.log(`Task API running at http://localhost:${PORT}`);
});
