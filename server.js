// Dependencies.
const path = require('path');
const express = require('express');
const session = require('express-session');
// Import express-handlebars.
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Sets up Express App.
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers.
const hbs = exphbs.create({ helpers });

const sess = {
    secret: 'Super secret secret',
    cookie: {
        maxAge: 300000, // 5 mins.
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
    },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

// Inform Express.js on which template engine to use as default.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sets up the routes.
app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});
