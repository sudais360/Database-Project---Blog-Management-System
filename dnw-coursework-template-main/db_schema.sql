-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS testUsers (
    test_user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS testUserRecords (
    test_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_record_value TEXT NOT NULL,
    test_user_id  INT NOT NULL, --the user that the record belongs to
    FOREIGN KEY (test_user_id) REFERENCES testUsers(test_user_id)
);

--insert default data (if necessary here)

INSERT INTO testUsers ('test_name') VALUES ('Simon Star');
INSERT INTO testUserRecords ('test_record_value', 'test_user_id') VALUES( 'Lorem ipsum dolor sit amet', 1); --try changing the test_user_id to a different number and you will get an error


PRAGMA foreign_keys = ON;

--Database for Settings 
CREATE TABLE IF NOT EXISTS settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    author TEXT NOT NULL
);

INSERT INTO settings (title, subtitle, author) VALUES ('Introduction to Database and Networking', 'CM2040', 'Sudais');

--Database for Articles 
CREATE TABLE IF NOT EXISTS articles (
    article_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    creation_date DATETIME NOT NULL,
    modification_date DATETIME NOT NULL,
    content TEXT NOT NULL,
    published INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0 
);


--Database for Comments  
CREATE TABLE IF NOT EXISTS comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    comment TEXT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE ON UPDATE CASCADE
);


COMMIT;

