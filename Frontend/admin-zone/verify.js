$(document).ready(function () {
      const token = getCookie('Authorization');
      
      if (!token) {
        // Redirect to login page if no token
        window.location.href = 'https://diettuty.onrender.com/admin-zone/login/index.html';
      } else {
        // Verify the token with the server
        $.ajax({
          url: 'http://127.0.0.1:5879/diet-admin/verify',  // Your API endpoint for token verification
          type: 'GET',
          headers: {
            'Authorization': token
          },
          success: function (response) {
            // Token is valid
            console.log('Token verified:', response);
          },
          error: function () {
            // Redirect to login if token is invalid
            window.location.href = 'https://diettuty.onrender.com/admin-zone/login/index.html';
          }
        });
      }
  });

  // Function to get a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }