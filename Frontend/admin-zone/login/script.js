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
        DisplayAlert(response.message, "success");
        $("#recoveryNotice").text(response.message).css("color", "green");
      },
      error: function(jqXHR, textStatus, errorThrown) {
        const errorMessage = jqXHR.responseJSON?.message || "Error sending recovery email";
        DisplayAlert(errorMessage, "danger");
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
        DisplayAlert("Login Successful.", "success");
        setTimeout(() => {
          window.location.href = '../';
      }, 1000);
       // Redirect to overview after login success
      } else {
        DisplayAlert("Login failed!", "danger");
      }
    },
    error: function () {
      console.log('Invalid credentials');
      DisplayAlert("Invalid credentials!", "danger");
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

function DisplayAlert(message, type = 'success') {
  // Create alert element
  const alertElement = document.createElement('div');
  alertElement.className = `alert alert-${type} alert-dismissible fade show d-flex justify-content-between align-items-center border`;
  alertElement.role = 'alert';
  alertElement.style.position = 'fixed';
  alertElement.style.top = '10px';
  alertElement.style.right = '-400px'; // Start off-screen
  alertElement.style.transition = 'right 0.6s ease'; // Transition for sliding effect
  alertElement.style.zIndex = '9999'; // Ensure it's on top
  alertElement.style.width = 'auto'; // Adjust width if necessary

  // Set inner HTML for message and close button with flex spacing
  alertElement.innerHTML = `
      <button type="button" class="btn-close p-0 border-0 bg-transparent" data-bs-dismiss="alert" aria-label="Close">
          <span>${message}</span>
      </button>
  `;

  // Append to body
  document.body.appendChild(alertElement);

  // Trigger a reflow to enable the CSS transition
  requestAnimationFrame(() => {
      alertElement.style.right = '10px'; // Slide into view
  });

  // Close button functionality
  alertElement.querySelector('.btn-close').addEventListener('click', () => {
      alertElement.style.right = '-400px'; // Slide out of view on close
      setTimeout(() => {
          alertElement.remove(); // Remove the element after transition
      }, 500); // Match the duration of the slide out
  });

  // Automatically remove the alert after 5 seconds
  setTimeout(() => {
      alertElement.style.right = '-400px'; // Slide out of view
      setTimeout(() => {
          alertElement.remove(); // Remove the element after transition
      }, 500); // Match the duration of the slide out
  }, 5000); // 5 seconds before it disappears
}