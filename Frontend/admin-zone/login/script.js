$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
      e.preventDefault();

      const username = $('#username').val();
      const password = $('#password').val();

      $.ajax({
        url: 'http://127.0.0.1:5879/diet-admin/login',  // Your API endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ username, password }),
        success: function (data) {
          if (data.token) {
            // Set the token as a cookie
            setCookie('Authorization', `Bearer ${data.token}`, 1);  // Expires in 1 day
            alert('Login successful!');
            window.location.href = '../';  // Redirect to overview after login success
          } else {
            alert('Login failed');
          }
        },
        error: function () {
          alert('Invalid credentials');
        }
      });
    });

    // Set cookie with expiration (in days)
    function setCookie(name, value, days) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  });