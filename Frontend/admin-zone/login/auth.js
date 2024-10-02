// Set cookie
const api = "http://127.0.0.1:5879/"

function setCookie(name, value, days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  
  // Get cookie by name
function getCookie(name) {
    let nameEQ = name + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookiesArray = decodedCookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
      let cookie = cookiesArray[i].trim();
      if (cookie.indexOf(nameEQ) == 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }
    return null;
  }
  
  // Check if token is valid
function checkToken() {
    const token = getCookie('token');
  
    if (!token) {
      // window.location.href = '/login';  // Redirect if no token found
    } else {
      $.ajax({
        url: api + '/verify-token',  // Endpoint to verify token validity
        type: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
        success: function () {
          // Token is valid, allow access to the page
        },
        error: function () {
          // Token invalid or expired, redirect to login page
          // window.location.href = '/login';
        }
      });
    }
  }
  