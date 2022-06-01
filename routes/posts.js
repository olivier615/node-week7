var express = require('express');
var router = express.Router();
const postsController = require('../controller/postsController.js')
const handleErrorAsync = require('../service/handleErrorAsync.js')
const checkParamsId = require('../service/checkParamsId.js')
const isAuth = require('../service/isAuth.js')

router.get('/', isAuth, handleErrorAsync(postsController.getAllPosts))
router.get('/:id', isAuth, checkParamsId, handleErrorAsync(postsController.getPost))
router.post('/', isAuth, handleErrorAsync(postsController.createPost))
router.post('/:id/likes', isAuth, handleErrorAsync(postsController.like))
router.delete('/:id/dislikes', isAuth, handleErrorAsync(postsController.dislike))

router.delete('/:id', isAuth, checkParamsId, handleErrorAsync(postsController.deletePost))
router.patch('/:id', isAuth, checkParamsId, handleErrorAsync(postsController.updatePost))
router.get('/user/:id', isAuth, handleErrorAsync(postsController.getUserPosts))
router.post('/:id/comment', isAuth, checkParamsId, handleErrorAsync(postsController.postComment))

router.delete('/:id/comment', isAuth, checkParamsId, handleErrorAsync(postsController.deleteComment))
router.patch('/:id/comment', isAuth, checkParamsId, handleErrorAsync(postsController.updateComment))


// router.delete('/', postsController.deleteAllPosts)

module.exports = router;
