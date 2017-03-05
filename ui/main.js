var submit=document.getElementByID('submit');
var username=document.getElementByID('username').value;
var password=document.getElementByID('password').value;
console.log(username);
console.log(password);
request.open('POST','http://parikhmihir.imad.hasura-app.io/login');
request.send(JSON.stringify({username:username, password:password}));