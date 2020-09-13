var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//Index route - show all campground
router.get('/', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//Create route - add new campground
router.post('/', middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author ={
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author:author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});

//New route - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
})

//Show route - shows more info about a campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit route - edit the campground details
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground});
    });
});

//Update route - updates the changes on campground
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy route - deletes the campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;