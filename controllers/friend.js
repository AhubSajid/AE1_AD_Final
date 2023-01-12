const Friend = require("../models/Friend");

exports.list = async (req, res) => {
  try {
    console.log(req.query)
    const message = req.query.message;
    const friends = await Friend.find({});
    res.render("friends", { friends: friends, message: message });
  } catch (e) {
    res.status(404).send({ message: "could not list friends" });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    await Friend.findByIdAndRemove(id);
    res.redirect("/friends");
  } catch (e) {
    res.status(404).send({
      message: `could not delete  record ${id}.`,
    });
  }
};


exports.create = async (req, res) => {

  try {
    const friend = new Friend({ name: req.body.name, id : req.body._id});
    await friend.save();
    res.redirect('/friends/?message=friend has been created')
  } catch (e) {
    if (e.errors) {
      console.log(e.errors);
      res.render('create-friend', { errors: e.errors })
      return;
    }
    return res.status(400).send({
      message: JSON.parse(e),
    });
  }
}

exports.edit = async (req, res) => {
  const id = req.params.id;
  try {
    const friend = await Friend.findById(id);
    res.render('update-friend', { friend: friend, id: id });
  } catch (e) {
    res.status(404).send({
      message: `could find friend ${id}.`,
    });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const friend = await Friend.updateOne({ _id: id }, req.body);
    res.redirect('/friends/?message=friend has been updated');
  } catch (e) {
    res.status(404).send({
      message: `could find friend ${id}.`,
    });
  }
};




