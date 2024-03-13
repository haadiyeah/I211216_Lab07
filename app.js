const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json());

let tasks = [];
let users = [];

//user authentication
router.post('/register', (req, res) => {
    const user = { id: users.length + 1, username: req.body.username, password: req.body.password };
    users.push(user);
    res.status(201).send(user);
});

router.post('/login', (req, res) => {
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password);
    if (!user) return res.status(400).send('Invalid username or password.');
    res.status(200).send('Logged in successfully.');
});

//task Creation
router.post('/tasks', (req, res) => {
    const task = {
        id: tasks.length + 1,
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        category: req.body.category,
        status: 'Incomplete',
        priority: req.body.priority,
        user: req.body.username
    };
    tasks.push(task);
    res.status(201).send(task);
});

//task Categorization
router.put('/tasks/:id/category', (req, res) => {
    const user = req.body.username;
    const task = tasks.find(t => t.id === parseInt(req.params.id) && t.user == user);
    if (!task) return res.status(404).send('no task found.');
    task.category = req.body.category;
    res.send(task);
});

//task status
router.put('/tasks/:id/status', (req, res) => {
    const user= req.body.username;
    const task = tasks.find(t => t.id === parseInt(req.params.id) && t.user == user);
    if (!task) return res.status(404).send('task not found ');
    task.status = req.body.status;
    res.send(task);
});

// View Tasks
router.get('/tasks', (req, res) => {
    const user =req.body.username;
    let result= tasks.filter((task) => task.username == user)
    if (req.query.sortBy) { //value of req.query.sortBy can be dueDate, category, status,priority etc.
        result= tasks.sort((a, b) => a[req.query.sortBy] > b[req.query.sortBy] ? 1 : -1);
    }
    res.send(result);
});

//priority Levels
router.put('/tasks/:id/priority', (req, res) => {
    const user = req.body.username;
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).send('The task with the given ID was not found.');
    task.priority = req.body.priority;
    res.send(task);
});

app.use('/api', router);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));