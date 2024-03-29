const router = require('express').Router();
const {
  //get all thoughts
  //get single thought
  //update thought
  addThought,
  removeThought,
  addReaction,
  removeReaction,
  getThought,
  getOneThought,
  updateThought,

} = require('../../controllers/thought-controller');

// /api/thoughts/<userId>
router.route('/:userId').post(addThought);

router.route("/thought/:thoughtId").get(getOneThought).put(updateThought)

// /api/thoughts/<userId>/<thoughtId>
router
  .route('/:userId/:thoughtId')
  .put(addReaction)
  .delete(removeThought);

// /api/thoughts/<userId>/<thoughtId>/<reactionId>
router.route('/:userId/:thoughtId/:reactionId').delete(removeReaction);

router.route("/").get(getThought);

module.exports = router;
