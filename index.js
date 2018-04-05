const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');


app.use(methodOverride('_method'));
const db = require('./db');


const pug = require('pug');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(session({
    secret: 'keyboard cat',
    userId:null
}));
app.use(express.static(path.join(__dirname, "public")));

app.all('*', (req, res, next) => {
    next();
});


// Partie Todos :
app.use('/todos', require('./controllers/todos'));

// Partie Users
app.use('/users', require('./controllers/users'));

// Page 404
app.use((req, res) => {
    res.send(404, '404, Il n\'y à rien par ici');
});
app.listen(PORT);