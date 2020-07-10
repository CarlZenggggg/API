const { new: _new, index, show, create, edit, update, delete: _delete } = require('../controllers/ResourceController');

function auth(req, res, next) {
  if (req.isAuthenticated() || (req.user && req.user.provider)) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router => {
  router.get('/resources', auth, index);
  router.get('/resources/new', auth, _new);
  router.post('/resources', auth, create);
  router.post('/resources/update', auth, update);
  router.post('/resources/delete', auth, _delete);
  router.get('/resources/:id/edit', auth, edit);
  router.get('/resources/:id', auth, show);
};