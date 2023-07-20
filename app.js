//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

// Load the full build.
var _ = require('lodash');

// Cherry-pick methods for smaller browserify/rollup/webpack bundles.
var at = require('lodash/at');
var curryN = require('lodash/fp/curryN');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-kshitij:Test123@cluster0.cdg7o.mongodb.net/blogDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = {
  title : String,
  content : String
}

const Post = mongoose.model("Post" , postSchema);



app.get("/", function(req , res){

  Post.find({} , function(err , posts){

    if(err){
      console.log(err);
    }

    else{

      res.render("home" , {content : posts , starting_content : homeStartingContent});

    }
  })

});

app.get("/blogs/:postId" , function(req , res){

    var reqd = req.params.postId

    Post.findOne({_id : reqd} , function(err , results){

      if(err){
        res.render("error");
        console.log(err);

      }

      else{

        res.render("post",{curr_post : results});

      }
    })

});

app.get("/home" , function(req , res){

  res.redirect("/");
})

app.get("/about" , function(req , res){

  res.render("about" , {content : aboutContent});
});

app.get("/contact" , function(req , res){

  res.render("contact" , {content : contactContent});
});

app.get("/compose" , function(req , res){

  res.render("compose");
});

app.get("/update/:post_id" , function(req  ,res){

  const curr_id = req.params.post_id;

  Post.findOne({_id : curr_id} , function(err , result){

    if(!err){

      res.render("update" , {curr_post : result});
    }
  })
});

app.post("/update/:post_id" , function(req , res){

  const curr_id = req.params.post_id;
  const new_title = req.body.post_title;
  const new_body = req.body.post_body;

  console.log(new_title);

  console.log(new_body);

  Post.updateOne({_id : curr_id} , {title : new_title , content : new_body} , function(err){
    if(err){
      console.log(err);
    }
  });

  res.redirect("/")
})


app.post("/compose" , function(req , res){
  const newpost = new Post({
    title : req.body.post_title,
    content : req.body.post_body
  })

  newpost.save(function(err){
     if(!err){
       res.redirect("/");

     }
  });

});

app.post("/delete" , function(req , res){

  const req_id = req.body.delete_btn;

  Post.deleteOne({_id : req_id } , function(err){});

  res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function() {
  console.log("Server started on port 3000");
});
