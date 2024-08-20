const express = require('express');
const router = express.Router();

// Middleware to get draft articles
function getDraftArticles(req, res, next) {
  let sqlQuery = "SELECT * FROM articles WHERE published = 0";

  global.db.all(sqlQuery, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.redirect("/");
    } else {
      res.locals.draftArticles = rows;
      next();
    }
  });
}

// Middleware to get published articles
function getPublishedArticles(req, res, next) {
  let sqlQuery = "SELECT * FROM articles WHERE published = 1  ORDER BY creation_date DESC ";

  global.db.all(sqlQuery, (err, rows) => {
    if (err) {
      console.error(err.message);
      res.redirect("/");
    } else {
      res.locals.publishedArticles = rows;
      next();
    }
  });
}

// Middleware to get settings
function getSettings(req, res, next) {
  let sqlQuery = "SELECT * FROM settings";

  global.db.get(sqlQuery, (err, settings) => {
    if (err) {
      console.error(err.message);
      res.redirect("/");
    } else {
      res.locals.settings = settings;
      next();
    }
  });
}

// Route to display author home page
router.get('/home', getDraftArticles, getPublishedArticles, getSettings, (req, res) => {
  res.render('author-home', {
    draftArticles: res.locals.draftArticles,
    publishedArticles: res.locals.publishedArticles,
    settings: res.locals.settings
  });
});

// Route to publish an article
function publishArticle(req, res) {
  const articleId = req.params.id;

  let sqlQuery = "UPDATE articles SET published = 1 WHERE article_id = ?";
  let params = [articleId];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
      res.redirect('/author/home');
    } else {
      res.redirect('/author/home');
    }
  });
}

router.post('/publish/:id', publishArticle);

// Route to create a new draft
router.get("/new-draft", function (req, res) {
  res.render("new-draft");
});

function createDraft(req, res) {
  const { title, subtitle, content } = req.body;
  const currentDate = new Date().toLocaleString();

  const sqlQuery = 'INSERT INTO articles (title, subtitle, content, creation_date, modification_date) VALUES (?, ?, ?, ?, ?)';
  const params = [title, subtitle, content, currentDate, currentDate];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
      res.redirect('/author/home');
    } else {
      res.redirect('/author/home');
    }
  });
}

router.post('/create-draft', createDraft);

// Route to delete an article
function deleteArticle(req, res) {
  const articleId = req.params.id;

  let sqlQuery = "DELETE FROM articles WHERE article_id = ?";
  let params = [articleId];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
    } else {
      res.redirect('/author/home');
    }
  });
}

router.post('/delete-article/:id', deleteArticle);

// Route to edit an article
router.get('/edit/:id', (req, res) => {
  const articleId = req.params.id;

  let sqlQuery = "SELECT * FROM articles WHERE article_id = ?";
  let params = [articleId];

  global.db.get(sqlQuery, params, (err, article) => {
    if (err || !article) {
      res.redirect('/author/home');
    } else {
      res.render('edit-article', { article: article });
    }
  });
});

// Route to update an article
function updateArticle(req, res) {
  const articleId = req.params.id;
  const { title, subtitle, content } = req.body;
  const currentDate = new Date().toLocaleString();

  let sqlQuery = "UPDATE articles SET title = ?, subtitle = ?, content = ?, modification_date = ? WHERE article_id = ?";
  let params = [title, subtitle, content, currentDate, articleId];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
      res.redirect('/author/home');
    } else {
      res.redirect('/author/home');
    }
  });
}

router.post('/update-article/:id', updateArticle);

// Route to display author settings form
router.get('/settings', getSettings, (req, res) => {
  res.render("author-settings", { settings: res.locals.settings });
});

// Route to update author settings
router.post('/update-settings', (req, res) => {
  const { title, subtitle, author } = req.body;

  // Update the settings in the database
  let sqlQuery = "UPDATE settings SET title = ?, subtitle = ?, author = ? WHERE setting_id = 1";
  let params = [title, subtitle, author];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
      res.redirect('/author/settings');
    } else {
      res.redirect('/author/home');
    }
  });
});

//// Route to get article comments
function getArticleComments(req, res) {
  const articleId = req.params.id;

  // Query the database to retrieve the comments for the article
  let commentsQuery = "SELECT * FROM comments WHERE article_id = ?";
  let commentsParams = [articleId];

  global.db.all(commentsQuery, commentsParams, (err, comments) => {
    if (err) {
      console.error("Error retrieving comments:", err.message);
      return res.status(500).send('Error retrieving comments');
    }

    // Render the article-comments.ejs template with comments data
    res.render('article-comments', { comments });
  });
}

router.get('/comments/:id', getArticleComments);

module.exports = router;
