const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// ================= HELPER FUNCTIONS =================

// Check if username already exists
const isValid = (username) => {
  let user = users.find(u => u.username === username);
  return user ? true : false;
};

// Check username & password
const authenticatedUser = (username, password) => {
  let user = users.find(u => u.username === username && u.password === password);
  return user ? true : false;
};


// ================= TASK 7 =================
// Login user
regd_users.post("/login", (req, res) => {

  const { username, password } = req.body;

  // Check input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Check credentials
  if (authenticatedUser(username, password)) {

    // Create JWT token
    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 }
    );

    // Save in session
    req.session.authorization = {
      accessToken: accessToken,
      username: username
    };

    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });

  } else {
    return res.status(208).json({ message: "Invalid login. Check username and password" });
  }

});


// ================= TASK 8 =================
// Add / Modify review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;

  // Get username from session
  const username = req.session.authorization.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });

});


// ================= TASK 9 =================
// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Delete only this user's review
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;