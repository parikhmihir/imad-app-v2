 // common packages that helps the server listen to a port
var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

// creating a javascript object "articles"
// articleOne articleTwo articleThree are the array members of object 'articles'
var article={
    articleOne: {
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
    articleTwo:{
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
    articleThree:{
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
};
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
`
return htmlTemplate;
}

app.get('/', function (req, res) {   // Handling specific URL's
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/:articleName',function (req, res) { //:articleName converts name into variables,its a property of "express"
    //articleName==articleOne
    //articles[articleName]==
     res.send(createTemplate(articles[articleName]));
});

app.get('/Article-two',function (req, res) {
     res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
app.get('/Article-three',function (req, res) {
     res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/mihir.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'mihir.jpg'));
});
app.get('/ui/profile.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'profile.html'));
});
var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
