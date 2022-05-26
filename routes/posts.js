var express = require('express');
var router = express.Router();
const postsController = require('../controller/postsController.js')
const handleErrorAsync = require('../service/handleErrorAsync.js')
const app = require('../app.js');
const checkPostId = require('../service/checkPostId.js')
const isAuth = require('../service/isAuth.js')

router.get('/', isAuth, handleErrorAsync(postsController.getAllPosts))
router.get('/:id', isAuth, checkPostId, handleErrorAsync(postsController.getPost))
router.post('/', isAuth, handleErrorAsync(postsController.createPost))
router.post('/:id/likes', isAuth, handleErrorAsync(postsController.like))
router.delete('/:id/likes', isAuth, handleErrorAsync(postsController.dislike))

router.delete('/:id', isAuth, checkPostId, handleErrorAsync(postsController.deletePost))
router.patch('/:id', isAuth, checkPostId, handleErrorAsync(postsController.updatePost))
router.get('/user/:id', isAuth, handleErrorAsync(postsController.getUserPosts))


// router.delete('/', postsController.deleteAllPosts)

module.exports = router;
