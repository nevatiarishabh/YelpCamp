var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://cf.bstatic.com/images/hotel/max1024x768/234/234843649.jpg"
//     }, function(err, res){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created CG!");
//             console.log(res);
//         }
//     });

var campgrounds = [ 
    {name: "Salmon Creek", image: "https://cf.bstatic.com/images/hotel/max1024x768/234/234843649.jpg"},
    {name: "Granite Hill", image: "https://imgmedia.lbb.in/media/2019/10/5da5ae92263917793a3b308c_1571139218919.jpg"},
    {name: "Mountain Goat's Rest", image: "https://www.exoticamp.com/wp-content/uploads/2018/04/29983061_640965312923162_4735239029177375606_o.jpg"}
]

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render('campgrounds', {campgrounds: allCampgrounds});
        }
    });
});

app.post('/campgrounds', function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', function(req, res){
    res.render('new');
})

app.listen(3000, function(){
    console.log("Server listening on port 3000..");
});