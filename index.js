const express = require('express');

const app = express();
const mysql = require('mysql');

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection({
  host: 'localhost',
  database: 'books',
  user: 'root',
  password: 'root',
});

// ----- database connection ----- //
db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log('database connected');
  }
});

// ----- get list of books ----- //
app.get('/books', (req, res) => {

  db.query('SELECT books.id as bookid, books.name as bookname, isbn, books.author, author.name as authorname, country FROM books INNER JOIN author ON books.author = author.id', (err, rows) => {
    
    if (err) {
      res.sendStatus(500)
    } else {

      // Nested Query:
      let result = rows.map(book => ({
        id: book.bookid,
        name: book.bookname,
        isbn: book.isbn,
        author: {
          id: book.author,
          name: book.authorname,
          country: book.country
        }
      }))

      res.send(result)
    }
    
  });

});

// ----- get book by id ----- //
app.get('/books/:id', (req, res) => {
  db.query('SELECT id, name, author, isbn FROM books WHERE id = ?', [parseInt(req.params.id)], (err, rows) => {
    if (err) {
      res.sendStatus(500)
    } else if (rows.length === 0) {
      res.sendStatus(404)
    } else {
      res.send(rows);
    }
  });
});

// ----- create new book ----- //
app.post('/books', (req, res) => {
  db.query('INSERT INTO books (name,isbn,author) VALUES (?,?,?)', [req.body.name, req.body.isbn, req.body.author], (err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(201)
    }
  });
});

// ----- modify book by id ----- //
app.put('/books/:id', (req, res) => {
  db.query('UPDATE books SET name = ?, id = ?, isbn = ? WHERE id = ?', [req.body.name, req.body.author, req.body.isbn, parseInt(req.params.id)], (err, rows) => {
    if (err) {
      res.sendStatus(500)
    } else if (rows.length === 0) {
      res.sendStatus(404)
    } else {
      res.send(`Book n° ${req.params.id} has been updated.`);
    }
  });
});

// ----- delete book by id ----- //
app.delete('/books/:id', (req, res) => {
  db.query('DELETE FROM books WHERE id=?', [req.params.id], (err, rows) => {
    if (err) {
      res.sendStatus(500)
    } else if (rows.affectedRows === 0) {
      res.sendStatus(404)
    } else {
      res.send(`Book n° ${req.params.id} deleted.`);
    }
  });
});



// ----- get list of authors ----- //
app.get('/author', (req, res) => {
  db.query('SELECT id, name, country FROM author', (err, rows) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.send(rows);
    }
  });
});

// ----- create new author ----- //
app.post('/author', (req, res) => {
  db.query('INSERT INTO author (name,country) VALUES (?,?)', [req.body.name, req.body.country], (err) => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(201)
    }
  });
});

// ----- modify author ----- //
app.put('/author/:id', (req, res) => {
  db.query('UPDATE author SET name = ?, country = ? WHERE id = ?', [req.body.name, req.body.country, parseInt(req.params.id)], (err, rows) => {
    if (err) {
      res.sendStatus(500)
    } else if (rows.length === 0) {
      res.sendStatus(404)
    } else {
      res.send(`Book n° ${req.params.id} has been updated.`);
    }
  });
});

// ----- delete author ----- //
app.delete('/author/:id', (req, res) => {
  db.query('DELETE FROM author WHERE id=?', [req.params.id], (err, rows) => {
    if (err) {
      res.sendStatus(500)
    } else if (rows.affectedRows === 0) {
      res.sendStatus(404)
    } else {
      res.send(`Book n° ${req.params.id} deleted.`);
    }
  });
});


// ----- mounting server ----- //
app.listen(PORT, () => {
  console.log(`server working on port ${PORT}`);
});
