require("dotenv").config();
module.exports = {
  //'url': 'mongodb://localhost:27017/yelp_camp'
  'url': process.env.ATLAS_URL
};