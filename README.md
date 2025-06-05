# Task API

A simple REST API for managing tasks built with Node.js and Express.

---

## Features

- Get all tasks: `GET /api/tasks`
- Add a new task: `POST /api/tasks`
- Mark a task as completed: `PUT /api/tasks/:id`
- Delete a task: `DELETE /api/tasks/:id`

Tasks are stored in a local JSON file (`tasks.json`) for persistence.

