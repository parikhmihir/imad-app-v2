 // common packages that helps the server listen to a port
var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

// creating a javascript object "articleone"
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
      heading: 'Article-One',
      content: `
            <p>
                Lal Bahadur Shastri, the former prime minister of India is not much known among the youth of India, since his contributions to the nation are not seen by many.
            </p>
            <p>
                    While India had to import about five percent of the total foodgrains available in the country in the 1950s, food shortages worsened during the 1960s when two severe drought years led to a sharp increase in import of foodgrains
            </p>
      `
    }
}
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

app.get('/Article-one',function (req, res) {
     res.send(createTemplate(articleOne));
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
