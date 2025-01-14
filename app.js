const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const Campground = require('./models/campground');

const app = express();
app.engine('ejs', ejsMate)
mongoose.connect('mongodb://localhost:27017/yelp-camp')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

// SHOW ALL CAMPGROUNDS

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds });
})

// NEW CAMPGROUND

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// SHOW ONE CAMPGROUND

app.get('/campgrounds/:id', async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
})

// UPDATE

app.get('/campgrounds/:id/update', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/update', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {... req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
})

// DELETE

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})