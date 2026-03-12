import express from 'express';
import mysql2 from 'mysql2'
import dotenv from 'dotenv'
import { validateForm } from './validation.js';
const app = express();
const PORT = 3000;
app.use(express.static('public'));
dotenv.config();
validateForm();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// "Middleware" that allows express to read
// form data and store it in req.body
app.use(express.urlencoded({ extended: true }));

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
}).promise();

// Default route
app.get('/', (req, res) => {
    res.render('home');
});

// Contact route
app.get('/contact-us', (req, res) => {
    res.render('contact');
});

// Confirmation route
app.get('/thank-you', (req, res) => {
    res.render('confirmation');
});

// Admin route
app.get('/admin', async(req, res) => {
    // read all from database.
    // newest entries first.
    let sql = "SELECT * FROM orders ORDER BY timestamp DESC";
    const orders = await pool.query(sql);
    console.log(orders);

    res.render('admin', { orders: orders[0] });
});

// Submit order route
// {"fname":"a","lname":"aa","email":"a",
// "method":"delivery","toppings":["artichokes"],
// "size":"small","comment":"","discount":"on"}
app.post('/submit-order', async(req, res) => {
    
    const order = req.body;

    validateForm(order);

    // Create a JSON object to store the order data
    const params = {
        fname: params.fname,
        lname: params.lname,
        email: params.email,
        method: params.method,
        toppings: Array.isArray(params.toppings) ? params.toppings.join(",") : "none",
        size: params.size,
        comment: params.comment
    };

    // Add order object to orders array
    // remember: sql injection (HACK)
    const sql = `INSERT INTO orders (fname, lname, email, size, method, toppings)
    VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await pool.query(sql);

    res.render('confirmation', { order });
});

app.get('/db-test', async(req, res) => {
    try {
        const pizza_orders = await pool.query('SELECT * FROM orders');
        res.send(pizza_orders[0]);
    } catch (err) {
        console.log('Database error: ', err);
    }
});

// Listen on the designated port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});