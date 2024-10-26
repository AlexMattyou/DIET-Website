$(document).ready(function () {

});

function forgotPassword() {
  $("#loginForm").fadeOut(200, function() {
    $("#recoveryEmail").fadeIn(200).removeClass("d-none");
  });
}

function validateEmail() {
  const emailInput = $("#email").val();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
  $("#sendRecoveryBtn").prop("disabled", !isValidEmail);
}

function sendRecoveryEmail() {
  const emailInput = $("#email").val();

  // Validate email format before proceeding
  if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
    // Show loading notice while request is processed
    $("#recoveryEmail").fadeOut(200, function() {
      $("#recoveryNotice").fadeIn(200).removeClass("d-none");
    });


    // Send POST request to reset-request endpoint

    const data = {
      email: emailInput,
  };

    // Perform the AJAX request to upload the file
    $.ajax({
      url: 'https://diet-api-dm7h.onrender.com/diet-admin/reset-request', // Your API endpoint
      type: 'POST',
      contentType: "application/json", // Send as JSON
      data: JSON.stringify(data),   // Important
      success: function(response) {
        $("#recoveryNotice").text(response.message).css("color", "green");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        const errorMessage = jqXHR.responseJSON?.message || "Error sending recovery email";
        $("#recoveryNotice").text(errorMessage).css("color", "red");
      }
    });
  }
}



function goToLogin() {
  $("#recoveryNotice").fadeOut(200, function() {
    $("#loginForm").fadeIn(200).removeClass("d-none");
  });
}

$('#loginForm').on('submit', function (e) {
  e.preventDefault();

  const username = $('#username').val();
  const password = $('#password').val();


  $.ajax({
    url: 'https://diet-api-dm7h.onrender.com/diet-admin/login',  // Your API endpoint
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ username, password }),
    success: function (data) {
      if (data.token) {
        // Set the token as a cookie
        setCookie('Authorization', `Bearer ${data.token}`, 1);  // Expires in 1 day
        console.log('Login successful!');
        window.location.href = '../';  // Redirect to overview after login success
      } else {
        console.log('Login failed');
      }
    },
    error: function () {
      console.log('Invalid credentials');
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