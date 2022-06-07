var express = require('express');
var router = express.Router();
const usersController = require('../controller/usersController.js')
const handleErrorAsync = require('../service/handleErrorAsync.js')
const isAuth = require('../service/isAuth.js')
const checkParamsId = require('../service/checkParamsId.js')

router.get('/', isAuth, handleErrorAsync(usersController.checkUser))

router.post('/sign_up', handleErrorAsync(usersController.userSign_up))
router.post('/sign_in', handleErrorAsync(usersController.userSign_in))
router.post('/updatePassword', isAuth, handleErrorAsync(usersController.updatePassword))
router.get('/profile', isAuth, handleErrorAsync(usersController.userProfile))
router.patch('/profile', isAuth, handleErrorAsync(usersController.updateProfile))
router.get('/likeList', isAuth, handleErrorAsync(usersController.getLikeList))
router.post('/:id/follow', isAuth, handleErrorAsync(usersController.followAnUser))
router.delete('/:id/unFollow', isAuth, handleErrorAsync(usersController.unFollowAnUser))

module.exports = router