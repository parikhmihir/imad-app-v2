 // common packages that helps the server listen to a port
var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto=require('crypto'); // library for hashing the pasword
var bodyParser=require('body-parser');
var session = require('express-session');
var config={
    user:'parikhmihir',
    database:'parikhmihir',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomSecretValue',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30}
}));

// creating a javascript object "articles"
// articleOne articleTwo articleThree are the array members of object 'articles'
/*var articles={
    'article-one': {
      title:  'Articles',
      heading: 'Article-One',
      content: `
            <p>
                Lal Bahadur Shastri, the former prime minister of India is not much known among the youth of India, since his contributions to the nation are not seen by many.
            </p>
            <p>
                    While India had to import about five percent of the total foodgrains available in the country in the 1950s, food shortages worsened during the 1960s when two severe drought years led to a sharp increase in import of foodgrains
            </p>
      `
    },
    'article-two':{
        title:  'Articles',
      heading: 'Article-Two',
      content: `
            <p>
                He also led the nation to victory in the 1965 war. In all he led the nation towards self-sufficiency by stopping to import agricultural products from other nations and becoming self-reliant in it.
            </p>
            <p>
                   After all these efforts, his contributions are not known to many. He shares his birth anniversary with Mahatma Gandhiji, but still many of the citizens are unaware about it.People do remember Mahatma Gandhiji, Pandit Nehruji and Sardar Vallabhai Patelji, but he is still an unsung hero of the nation. He is not as famous as many other leaders, which is really sad. 
            </p>
      `
    },
    'article-three':{
        title:  'Articles',
      heading: 'Article-Three',
      content: `
            <p>
               There are lot of rumours regarding the mysterious death of Shashtriji in Tashkent in 1966.
            </p>
            <p>
                    It was his simplicity and hard work that brought him to that level to lead the nation toward progress.
                    Sources and Motivation: A documentary on Zee news.
            </p>
      `
    }
};*/
function createTemplate(data) {
    var title=data.title;
    var heading=data.heading;
    var content=data.content;
    var htmlTemplate= `
    <!DOCTYPE html>
    <head>
        <title>${title}</title>
    </head>
    <body align="center">
        <a href="/">Go BACK</a>
        <h1 aligm="center">
            ${heading}
        </h1>
        ${content}
    </body>
</html>
`;
return htmlTemplate;
}

// Creating the hashed value of our credentials
function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ['pbkdf2',10000,salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input', function(req,res){
    var hashedString=hash(req.params.input,'This is just a random string');
    res.send(hashedString);
});

// create a new user
app.post('/add-user',function(req,res){
    // Take the input of user and his password
    var username=req.body.username;
    var password=req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');  // Salt is a random string
    var dbString=hash(password,salt);
     Pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
    if(err){
           res.status(500).send(err.toString());
       }else{
           res.send(JSON.stringify(result.rows));
       }    
    });
});

// Logging in the user
app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   Pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

var Pool=new Pool(config);
app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});


/*app.get('/test-db',function(req,res){ //request to an end point
   // Make a select request 
   // Make a response with the results
   Pool.query('SELECT * FROM test', function(err, result){
       if(err){
           res.status(500).send(err.toString());
       }else{
           res.send('User successfully created'+username);
       }
   });
});*/
    

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  Pool.query("SELECT * FROM articles WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
        }
    }
  });
});

app.get('/', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/mihir.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'mihir.jpg'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/ui/profile.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile.html'));
});
app.get('/ui/articles.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articles.html'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
