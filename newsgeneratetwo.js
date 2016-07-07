/*NewsGenerate*/
"use strict";

var request = require("request");
var config = require("./config.js");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var Article = require("./models/articleListing.js");
var firstUrl = "http://vancouversun.com/category/news/page/3";
var mainUrl = "http://vancouversun.com/category/news";

function getNewsData(targetUrl){
  mongoose.connect(config.db, function(err){
    if(err)
      console.error("Something Went Wrong with the DB Conn.  Details: %s", err);

    request(targetUrl, function(err, status, data){
      var $ = cheerio.load(data);

      var urlContainer = [];

      $("article h2 a, article h3 a, article h4 a").each(function(){

        var currArticle = new Article({
          title: $(this).text().trim(),
          url: $(this).attr("href"),
          source: "Vancouver Sun"
        });

        Article.find({title: currArticle.title}, function(err, articles){
          if(err)
            throw err;
          if(Object.keys(articles).length === 0){
            currArticle.save(function(err, data){
              if(err)
                console.error(err);
              console.log(data);
            });
          }else{
            console.log("Article exists already. Title: %s", articles[0].title);
          }
        });


        urlContainer.push(currArticle);
      });

      console.log(urlContainer.length);
    });
  });
}

//getNewsData(firstUrl);
getNewsData(mainUrl);
