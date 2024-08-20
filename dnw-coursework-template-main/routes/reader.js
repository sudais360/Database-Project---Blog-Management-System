const express = require('express');
const router = express.Router();

// Add the body-parser middleware
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Function to retrieve articles and settings
function getArticles(req, res, next) {
  let sqlQueryArticles = "SELECT * FROM articles WHERE published = 1  ORDER BY creation_date DESC ";
  let sqlQuerySettings = "SELECT * FROM settings";

  global.db.all(sqlQueryArticles, (err, articles) => {
    if (err) {
      console.error(err.message);
      res.redirect("/");
    } else {
      global.db.get(sqlQuerySettings, (err, settings) => {
        if (err) {
          console.error(err.message);
          res.redirect("/");
        } else {
          res.locals.articles = articles;
          res.locals.settings = settings;
          next();
        }
      });
    }
  });
}

// GET route for reader's home page
router.get('/home', getArticles, (req, res) => {
  res.render('reader-home', {
    articles: res.locals.articles,
    settings: res.locals.settings
  });
});

// GET route for displaying the article details
router.get('/article/:id', getArticleDetails);

// Function to retrieve the article details
function getArticleDetails(req, res) {
  const articleId = req.params.id;

  // Query the database to retrieve the article by its ID
  let sqlQuery = "SELECT * FROM articles WHERE article_id = ?";
  let params = [articleId];

  global.db.get(sqlQuery, params, (err, article) => {
    if (err || !article) {
      // Handle the error or article not found
      res.redirect('/reader/home');
    } else {
      // Fetch the comments associated with the article
      const commentsQuery = "SELECT * FROM comments WHERE article_id = ?";
      const commentsParams = [articleId];

      global.db.all(commentsQuery, commentsParams, (err, comments) => {
        if (err) {
          console.error(err.message);
          comments = []; // Initialize comments as an empty array if an error occurs
        }

        // Render the article details page and pass the article and comments data
        res.render('article-details', { article: article, comments: comments });
      });
    }
  });
}

// POST route for submitting comments
router.post('/comment/:id', submitComment);

function submitComment(req, res) {
  const articleId = req.params.id;
  const { name, comment } = req.body;

  // Insert the comment into the database
  let sqlQuery = "INSERT INTO comments (article_id, name, comment, created_at) VALUES (?, ?, ?, datetime('now'))";
  let params = [articleId, name, comment];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
      res.sendStatus(500); // If there's an error, send a server error response
    } else {
      res.redirect(`/reader/article/${articleId}`); // Redirect back to the article details page
    }
  });
}

// POST route for liking an article
router.post('/like/:id', likeArticle);

function likeArticle(req, res) {
  const articleId = req.params.id;

  // Update the likes count in the database
  let sqlQuery = "UPDATE articles SET likes = likes + 1 WHERE article_id = ?";
  let params = [articleId];

  global.db.run(sqlQuery, params, function (err) {
    if (err) {
      console.error(err.message);
      res.sendStatus(500); // If there's an error, send a server error response
    } else {
      // Retrieve the updated likes count from the database
      let likesQuery = "SELECT likes FROM articles WHERE article_id = ?";
      global.db.get(likesQuery, params, (err, row) => {
        if (err) {
          console.error(err.message);
          res.sendStatus(500); // If there's an error, send a server error response
        } else {
          res.json({ likes: row.likes }); // Send the updated likes count as JSON response
        }
      });
    }
  });
}


module.exports = router;
