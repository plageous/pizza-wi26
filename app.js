import express from 'express';
const app = express();
const PORT = 3000;
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// "Middleware" that allows express to read
// form data and store it in req.body
app.use(express.urlencoded({ extended: true }));

// Create a temp array to store orders
const orders = []; 

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
app.get('/admin', (req, res) => {
    res.render('admin', { orders });
});

// Submit order route
// {"fname":"a","lname":"aa","email":"a",
// "method":"delivery","toppings":["artichokes"],
// "size":"small","comment":"","discount":"on"}
app.post('/submit-order', (req, res) => {
    
    // Create a JSON object to store the order data
    const order = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        method: req.body.method,
        toppings: req.body.toppings ? req.body.toppings : "none",
        size: req.body.size,
        comment: req.body.comment,
        timestamp: new Date()
    };

    // Add order object to orders array
    orders.push(order);
    res.render('confirmation', { order });
});

// Listen on the designated port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});