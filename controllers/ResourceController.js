// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/
const viewPath = 'resources';
const Book = require('../models/Resource');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const books = await Book
      .find().populate('author')
      .sort({ updatedAt: 'desc' });

    res.render(`${viewPath}/index`, {
      pageTitle: 'Books',
      resources: books
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the archive: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author');

    res.render(`${viewPath}/show`, {
      pageTitle: book.title,
      resource: book
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this resource: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Book'
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({ email: email });

    const book = await Book.create({ author: user._id, ...req.body });

    req.flash('success', 'Resource created successfully');
    res.redirect(`/resources/${book.id}`);
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

    const book = await Book.findById(req.params.id).populate('author');
    if (book.author.id == user.id) {
      res.render(`${viewPath}/edit`, {
        pageTitle: book.title,
        formData: book
      });
    } else {
      res.redirect(`/resources/${book.id}`);
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

    let book = await Book.findById(req.body.id).populate('author');
    if (!book) throw new Error('Resource could not be found');

    const attributes = { author: user._id, ...req.body };
    await Book.validate(attributes);
    await Book.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The resource was updated successfully');
    res.redirect(`/resources/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this resource: ${error}`);
    res.redirect(`/resources/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    await Book.deleteOne({ _id: req.body.id });
    req.flash('success', 'The resource was deleted successfully');
    res.redirect(`/resources`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this resource: ${error}`);
    res.redirect(`/resources`);
  }
};