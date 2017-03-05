var submit=document.getElementByID('submit');
var nameInput=document.getElementByID('username');
var name=nameInput.value;
request.open('POST','http://parikhmihir.imad.hasura-app.io/login');
request.send();