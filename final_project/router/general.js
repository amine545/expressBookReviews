const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ================= TASK 6 =================
public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered" });
});


// ================= TASK 10 =================
// Get all books using async/await + axios
public_users.get('/', async function (req, res) {

  try {
    const response = await axios.get("http://localhost:5000/books");

    return res.status(200).json(response.data);

  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }

});


// ================= TASK 11 =================
// Get book by ISBN using async/await + axios
public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);

    return res.status(200).json(response.data);

  } catch (err) {
    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }

});


// ================= TASK 12 =================
// Get books by author using async/await + axios
public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {
    const response = await axios.get("http://localhost:5000/books");

    let filtered_books = Object.values(response.data).filter(
      book => book.author === author
    );

    return res.status(200).json(filtered_books);

  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }

});


// ================= TASK 13 =================
// Get books by title using async/await + axios
public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {
    const response = await axios.get("http://localhost:5000/books");

    let filtered_books = Object.values(response.data).filter(
      book => book.title === title
    );

    return res.status(200).json(filtered_books);

  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }

});


// ================= TASK 5 =================
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(books[isbn].reviews);

});


module.exports.general = public_users;