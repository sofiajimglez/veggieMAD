const express = require('express');
const router = express.Router();
const users = require('../controllers/users.controller');
const businesses = require('../controllers/business.controller');

const usersMid = require('../middlewares/users.mid');
const businessMid = require('../middlewares/business.mid');
const secure = require('../middlewares/secure.mid')

/* User routes */
router.post('/users', users.create);
router.get('/users/:id', secure.userAuth, usersMid.exists, usersMid.isOwned, users.detail);
router.patch('/users/:id', secure.userAuth, usersMid.exists, usersMid.isOwned, users.update);
router.delete('/users/:id', secure.userAuth, usersMid.exists, usersMid.isOwned, users.delete);

/* Business routes */
router.post('/businesses', businesses.create);
router.get('/businesses', businesses.list);
router.get('/businesses/:id', businessMid.exists, businesses.detail);
router.patch('/businesses/:id', secure.businessAuth, businessMid.exists, businessMid.isOwned, businesses.update);
router.delete('/businesses/:id', secure.businessAuth, businessMid.exists, businessMid.isOwned, businesses.delete);

/* Login routes */
router.post('/login/users', users.login);
router.post('/login/businesses', businesses.login);


module.exports = router;
