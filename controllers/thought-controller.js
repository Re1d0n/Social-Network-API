const { Thought, User } = require('../models');

const thoughtController = {
  //get all thoughts
getThought({params, body }, res) {
  Thought.find()
  .then((_data) =>{
    res.json(_data)
  }) .catch(err => res.json(err));
},

  //get single thought
getOneThought({params, body}, res) {
  Thought.findOne({_id: params.id})
  .then((_data) =>{ 
    if (!_data) {
      res.status(404).json({ message: 'No thought found with this id!' });
      return;
    }
    res.json(_data)
  }) .catch(err => res.json(err));
  
},

  //update thought
updateThought({params, body}, res) {
  Thought.findOneAndUpdate({ _id: params.thoughtId },{$set: body}, { new: true })
  .then(dbThoughtData => {
    console.log(dbThoughtData);
    if (!dbThoughtData) {
      res.status(404).json({ message: 'No thought can be found!' });
      return;
    }
    res.json(dbThoughtData);
  })
  .catch(err => res.json(err));

},

  // creating thought
  addThought({ params, body }, res) {
    console.log(params);
    Thought.create(body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        console.log(dbUserData);
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },
  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = thoughtController;
