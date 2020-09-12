var express = require('express');
var router = express.Router({mergeParams: true});

var Campground = require('../models/campground');
var Comment = require('../models/comment');

//Comments new
router.get('/new', isLoggenIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new',{campground: campground});
        }
    });
});

//Comments create
router.post('/', isLoggenIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/'+campground._id);
                }
            });
        }
    });
});

//middleware
function isLoggenIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;