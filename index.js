const Joi = require('joi');  // using "joi" for validation
const express = require("express"); // returns a function
const app = express(); // returns an object

app.use(express.json());  // returns a piece of middleware to be "used" in the request pipeline

const courses = [
  { id: 1, name: 'Learning Node' },
  { id: 2, name: 'Learning React' },
  { id: 3, name: 'Learning Redux' },
];

app.get("/", (req, res) => {
  res.send("This is the site root directory!");
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

const validateCourse = course => {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
};

app.post('/api/courses', (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const course = {
    id: courses.length + 1,
    name: req.body.name
  }
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found');
  
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  course.name = req.body.name;
  res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send('The course with the given ID was not found');

  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));