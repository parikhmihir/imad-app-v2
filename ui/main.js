function login(){
    var submit=document.getElementById('submit');
submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                console.log('User Logged in...');
                alert('Logged in successfully');
          }
          else if (request.status===403){
              alert('Username/password is incorrect');
        }
        else if (result.status===500){
            alert('Something went wrong with the server');
        }
          // Not done yet
        }
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        };
        };   
    }