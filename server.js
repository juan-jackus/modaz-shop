const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorsHandler = require('./utils/errorsHandler');
const { getModazHomepageData } = require('./controllers/modazController');

require('dotenv').config();

// connect to mongodb
mongoose
  .connect(process.env.DB_STRING_PROD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // autoIndex: false,
  })
  .then(() => console.log('connect to db successful'))
  .catch((err) => console.log(err));

// Routes
const shopRoutes = require('./routes/modaz-routes/shopRoutes');
const blogRoutes = require('./routes/modaz-routes/blogRoutes');
const authRoutes = require('./routes/modaz-routes/authRoutes');
const dashboardRoutes = require('./routes/dashboard-routes/dashboardRoutes');
// Set View Engine
app.set('view engine', 'ejs');
// Set Local Variable
app.locals.appName = process.env.APP_NAME;
app.locals.appLink = process.env.APP_LINK;
// Set Folders
app.locals.publicPath = path.join(__dirname, 'public');
app.locals.viewsPath = path.join(__dirname, 'views');

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'developpement') {
  const cors = require('cors');
  app.use(cors({ origin: app.locals.appLink, credentials: true }));
}
app.use(express.static(path.join(__dirname, 'public')));

// Modaz Shop Routes
app.get('/', getModazHomepageData, (req, res) => {
  const { carousel, newProducts, bestSellingProducts, posts } = req.body;
  const active = 'home';
  const title = req.app.locals.appName;
  res.render('index', {
    active,
    title,
    carousel,
    newProducts,
    bestSellingProducts,
    posts,
  });
});
app.get('/faqs', (req, res) => {
  const active = 'faqs';
  const title = 'Faqs - ' + req.app.locals.appName;
  res.render('faqs', { active, title });
});
app.get('/contact', (req, res) => {
  const active = 'contact';
  const title = 'Contact Us - ' + req.app.locals.appName;
  res.render('contact', { active, title });
});
app.use('/home', shopRoutes);
app.use('/shop', shopRoutes);
app.use('/blog', blogRoutes);
app.use('/account', authRoutes);

// Admin Dashboard Route
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '_dashboard', 'build')));
  app.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.resolve(__dirname, '_dashboard', 'build', 'index.html'));
  });
}

// Api Route
app.use('/api', dashboardRoutes);

// Unknown Route Handler
app.use((req, res) => {
  const title = 'Page Not Found - ' + req.app.locals.appName;
  const active = '';
  res.status(404).render('404', { active, title });
});

// Error Middleware Handler
app.use(errorsHandler);

app.listen(process.env.PORT || 5000, () => {
  if (process.env.NODE_ENV === 'developpement') {
    console.log('Listening on port 5000');
  }
});
