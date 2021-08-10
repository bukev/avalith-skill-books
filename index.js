const express = require('express')
const app = express()
const mysql = require('mysql')
const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection({
    host: 'localhost',
    database: 'books',
    user: 'root',
    password: 'root'
})

db.connect((err) => {
    if (err) {
        throw err
    } else {
        console.log('database connected')
    }
})



// ----- get list of books ----- //
app.get('/books', (req, res) => {
    db.query('SELECT * FROM books', (err, rows, fields) => {
        if (err) throw err
        res.send(rows)
    })
})

// ----- get book by id ----- //
app.get('/books/:id', (req, res) => {
    db.query('SELECT * FROM books WHERE id = ?', [parseInt(req.params.id)], (err, rows, fields) => {
        if (err) {
            throw err
        } else {

            if (rows == false) {
                res.send(`Book n° ${req.params.id} doesn't exist.`)
            } else {
                res.send(rows)
            }

        }
    })
})

// ----- create new book ----- //
app.post('/books', (req, res) => {
    db.query("INSERT INTO books (name,author,isbn) VALUES (?,?,?)", [req.body.name, req.body.author, req.body.isbn], (err, rows, fields) => {
        if (err) {
            throw err
        } else {
            res.send(`Book '${req.body.name}' ISBN ${req.body.isbn} created successfully.`)
        }
    })
})

// ----- modify book by id ----- //
app.put('/books/:id', (req, res) => {
    db.query("UPDATE books SET name = ?, author = ?, isbn = ? WHERE id = ?", [req.body.name, req.body.author, req.body.isbn, parseInt(req.params.id)], (err, rows, fields) => {
        if (err) {
            throw err
        } else {

            if (rows == false) {
                res.send(`Book n° ${req.params.id} doesn't exist.`)
            } else {
                res.send(`Book n° ${req.params.id} has been updated.`)
            }
        }

    })
})

// ----- delete book by id ----- //
app.delete('/books/:id', (req, res) => {
    db.query("DELETE FROM books WHERE id=?", [req.params.id], (err, rows, fields) => {
        if (err) {
            throw err
        } else {
            if (rows == false) {
                res.send(`Book n° ${req.params.id} doesn't exist.`)
            } else {
                res.send(`Book n° ${req.params.id} has been deleted.`)
            }
        }
    })
})



// ----- mounting server ----- //
app.listen(PORT, () => {
    console.log(`server working on port ${PORT}`)
})
