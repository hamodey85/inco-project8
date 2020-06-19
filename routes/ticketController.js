const ticket = require('../controllers/ticket/lib.js');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {authenticateJWT} = require('../auth/index')
const config = require('../config/config');



router.get('/create', authenticateJWT, ticket.createForm);
router.post('/create', authenticateJWT, ticket.create);
router.get('/:id', authenticateJWT, ticket.show);
router.get('/:id/edit', authenticateJWT, ticket.edit);
router.post('/comment', authenticateJWT, ticket.addComment);
router.post('/:id/update', authenticateJWT, ticket.update);
router.get('/', authenticateJWT, ticket.list);

module.exports = router;