var express = require('express');
var router = express.Router();
const usersController = require('../controller/usersController.js')
const handleErrorAsync = require('../service/handleErrorAsync.js')
const app = require('../app.js')
const isAuth = require('../service/isAuth.js')

router.post('/sign_up', handleErrorAsync(usersController.userSign_up))
router.post('/sign_in', handleErrorAsync(usersController.userSign_in))
router.post('/updatePassword', isAuth, handleErrorAsync(usersController.updatePassword))
router.get('/profile', isAuth, handleErrorAsync(usersController.userProfile))
router.patch('/profile', isAuth, handleErrorAsync(usersController.updateProfile))
router.get('/likeList', isAuth, handleErrorAsync(usersController.getLikeList))

module.exports = router