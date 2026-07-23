const express = require('express');
const app = express();
app.use((req, res, next) => {
  req.body = { test: 1 };
  req._body = true;
  next();
});
app.use(express.json());
app.post('/', (req, res) => res.json(req.body));
app.listen(3001, () => {
  console.log('started');
});
