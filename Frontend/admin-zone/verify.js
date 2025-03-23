$(document).ready(function () {
      const token = getCookie('Authorization');
      
      if (!token) {
        // Redirect to login page if no token
        window.location.href = 'https://diettut.org/admin-zone/login/';
      } else {
        // Verify the token with the server
        $.ajax({
          url: 'https://diettutapi.onrender.com/diet-admin/verify',  // Your API endpoint for token verification
          type: 'GET',
          headers: {
            'Authorization': token
          },
          success: function (response) {
            $('body').removeClass('no-mobile no-desktop d-none');
          },
          error: function () {
            // Redirect to login if token is invalid
            window.location.href = 'https://diettut.org/admin-zone/login/';
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