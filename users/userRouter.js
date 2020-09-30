const express = require('express');
const db = require('./userDb');
const postDb = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
    .then(user => {
      res.status(201).json({data: user});
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDb.insert({...req.body, user_id: req.params.id})
    .then(post => {
      res.status(201).json({data: post});
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json({data: users})
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

router.get('/:id', validateUserId, (req, res) => {
  db.getById(req.params.id)
    .then(user => {
      res.status(200).json({data: user});
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json({data: posts});
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.params.id)
    .then(user => {
      res.status(200).json({data: req.user.name + " removed."})
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  db.update(req.params.id, req.body)
    .then(user => {
      res.status(200).json({data: req.body});
    })
    .catch(err => {
      res.status(500).json({message: err.error});
    })
});

//custom middleware

function validatePost(req, res, next) {
  console.log(req.body);
  if (!req.body){
    return res.status(400).json({message: 'Missing user data.'})
  } else if (!req.body.text) {
    return res.status(400).json({message: 'Missing required text field.'});
  }

  next();
}

function validateUserId(req, res, next){
  db.getById(req.params.id)
    .then(user => {
      console.log(user);
      if (user){
        req.user = user;
        return next();
      } 
      return res.status(404).json({message: 'User not found.'});
    })
    .catch(err => {
      return res.status(400).json({message: 'Invalid user ID.'});
    })
}

function validateUser(req, res, next){
  if (!req.body){
    return res.status(400).json({message: 'Missing user data.'})
  } else if (!req.body.name) {
    return res.status(400).json({message: 'Missing required name field.'});
  }

  next();
}
module.exports = router;
