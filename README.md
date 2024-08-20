# Blog Management System

## Overview
This repository contains a simple blog management system that allows authors to create, manage, and publish articles, while readers can view and interact with these articles. The system is built using Node.js and Express, with SQLite as the database. It features a web-based interface for both authors and readers, allowing for easy management and interaction with content.

## Features

### Author's Interface
- **Manage Blog Settings**: Customize the blog’s title, subtitle, and author name.
- **Create Draft Articles**: Start new articles in draft mode, with options to edit, delete, or publish.
- **View and Manage Published Articles**: View published articles, check the number of likes, and interact with comments.
- **Generate Shareable Links**: Easily create links to share published articles.

### Reader's Interface
- **View Published Articles**: Browse through a list of published articles with titles, subtitles, and authors.
- **Interact with Articles**: Like articles, leave comments, and read comments from others.

## Project Structure
- **`Db_schema.sql`**: Contains the SQL script to set up the database with tables for settings, articles, and comments.
- **`index.js`**: Main server file that initializes the Express application and connects to the SQLite database.
- **`author.js`**: Contains route handlers and middleware specific to the author's operations like creating, editing, and deleting articles.
- **`reader.js`**: Contains route handlers and middleware specific to the reader's operations like viewing articles and leaving comments.
- **Views**: Contains various EJS templates for rendering the web pages for both authors and readers.

## Database Schema
- **Settings Table**: Stores blog settings such as title, subtitle, and author information.
- **Articles Table**: Stores articles with fields for title, subtitle, content, publication status, and number of likes.
- **Comments Table**: Stores comments associated with articles, including the author's name, the content of the comment, and a timestamp.

## How to Run
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/blog-management-system.git
   cd blog-management-system
