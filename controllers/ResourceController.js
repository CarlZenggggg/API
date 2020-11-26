const viewPath = 'resources';
const Sneaker = require('../models/Resource');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const sneakers = await Sneaker
      .find().populate('author')
      .sort({ updatedAt: 'desc' });

    res.render(`${viewPath}/index`, {
      pageTitle: 'Sneakers',
      resources: sneakers
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the archive: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id).populate('author');

    res.render(`${viewPath}/show`, {
      pageTitle: sneaker.name,
      resource: sneaker
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this resource: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'Add a new sneaker product'
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    const sneaker = await Sneaker.create({ author: user._id, ...req.body });

    req.flash('success', 'Resource created successfully');
    res.redirect(`/resources/${sneaker.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this resource: ${error}`);
    req.session.formData = req.body;
    res.redirect('/resources/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    const sneaker = await Sneaker.findById(req.params.id).populate('author');
    if (sneaker.author.id == user.id) {
      res.render(`${viewPath}/edit`, {
        pageTitle: sneaker.name,
        formData: sneaker
      });
    } else {
      res.redirect(`/resources/${sneaker.id}`);
    }

  } catch (error) {
    req.flash('danger', `There was an error accessing this resource: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    let sneaker = await Sneaker.findById(req.body.id).populate('author');
    if (!sneaker) throw new Error('Resource could not be found');

    const attributes = { author: user._id, ...req.body };
    await Sneaker.validate(attributes);
    await Sneaker.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The resource was updated successfully');
    res.redirect(`/resources/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this resource: ${error}`);
    res.redirect(`/resources/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Sneaker.deleteOne({ _id: req.body.id });
    req.flash('success', 'The resource was deleted successfully');
    res.redirect(`/resources`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this resource: ${error}`);
    res.redirect(`/resources`);
  }
};