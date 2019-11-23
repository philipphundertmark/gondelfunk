const express = require('express');
// const { getUsers } = require('./controllers');

// Create a new express router.
const router = new express.Router();

router.get('/', baseRoute);

// router.get('/users', getUsers);
// router.post('/users/:userId', postUser);
// router.put('/users/:userId', putUser);
// router.delete('/users/:userId', deleteUser);

/**
 * Default base route.
 *
 * @param {*} req Express HTTP request object.
 * @param {*} res Express HTTP response object.
 */
function baseRoute(req, res) {
  res.send('Hello from Gondelfunk!');
}

module.exports = router;
