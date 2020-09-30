const express = require('express');
const postRouter =  require('./posts/postRouter');
const userRouter = require('./users/userRouter');
const server = express();

server.use(express.json());
server.use(logger);
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (_, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


function logger(req, _, next) {
  console.log(
    "Method: ", req.method + "\n",
    "URL: ", req.url + "\n", 
    "Time: ", new Date(Date.now())
  )
  next();
}

module.exports = server
