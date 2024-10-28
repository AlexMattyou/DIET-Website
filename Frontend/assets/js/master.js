$(document).ready(function() {
  checkLogCookie();

  const scrollToNavBtn = $("#scrollToNavBtn");

  const $scrollButton = $('#scrollToNavBtn');
  const $breadcrumb = $('.breadcrumb');
  
  // Function to handle showing or hiding the button based on scroll position
  $(window).on('scroll', function () {
      const breadcrumbTop = $breadcrumb.offset().top; // Breadcrumb position from top of the page
      const windowScrollTop = $(this).scrollTop(); // Current scroll position

      // Show the button if the breadcrumb is scrolled out of view
      if (windowScrollTop > breadcrumbTop + $breadcrumb.height()) {
          $scrollButton.removeClass('d-none'); // Show button
      } else {
          $scrollButton.addClass('d-none'); // Hide button
      }
  });

  // Smooth scroll to breadcrumb when button is clicked
  $scrollButton.on('click', function () {
      $('html, body').animate({
          scrollTop: $breadcrumb.offset().top
      }, 500); // 500ms for smooth scrolling
  });

  GetOverview()
});

function checkLogCookie() {
  let logCookie = getCookie('log');

  if (!logCookie || isCookieExpired(logCookie)) {
      let currentDate = new Date();
      NewUser(); // Call NewUser if no 'log' cookie is found or it's expired
      setCookie('log', currentDate.toUTCString(), 24); // Set a new 'log' cookie with a 24-hour expiration
  }
}

// Function to check if the 'log' cookie is expired
function isCookieExpired(cookieValue) {
    const cookieDate = new Date(cookieValue);
    const currentDate = new Date();
    const timeDifference = currentDate - cookieDate;
    
    // 24 hours = 86400000 milliseconds
    return timeDifference > 86400000; // Return true if more than 24 hours have passed
}


/////////// for fixing nav bar ///////////////////
const navbar = document.getElementById("navbar");
  const breadcrumb = document.querySelector(".breadcrumb"); // Select the breadcrumb element
  const sticky = navbar.offsetTop;

  window.onscroll = function() {
    if (window.pageYOffset >= sticky) {
      navbar.classList.add("sticky");         // Add sticky class to navbar
      breadcrumb.classList.add("mt-5");       // Add mt-5 class to breadcrumb
    } else {
      navbar.classList.remove("sticky");      // Remove sticky class from navbar
      breadcrumb.classList.remove("mt-5");    // Remove mt-5 class from breadcrumb
    }
  };

 // Utility function to manage cookies
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000)); // Set expiry time
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(name + "=") == 0) {
      return c.substring(name.length + 1, c.length);
    }
  }
  return null;
}

// Function to change font size and store in cookie
function changeFontSize(value) {
  const root = document.documentElement;
  const currentSize = parseFloat(window.getComputedStyle(root).fontSize);
  
  // Set minimum and maximum sizes (50% and 150% of 16px)
  const minSize = 16 * 0.75; // 50% of default size
  const maxSize = 16 * 1.5; // 150% of default size
  
  const newSize = currentSize + value;
  
  // Ensure the new size is within bounds
  if (newSize >= minSize && newSize <= maxSize) {
    root.style.fontSize = newSize + "px";
    updateFontSizeDisplay(newSize);
    setCookie('fontSize', newSize, 1); // Store font size for 1 hour
  }
}

// Function to reset font size and update cookie
function resetFontSize() {
  const defaultSize = 16; // Default size in px
  document.documentElement.style.fontSize = defaultSize + "px";
  updateFontSizeDisplay(defaultSize);
  setCookie('fontSize', defaultSize, 1); // Reset to default in cookie
}

// Function to update the display of font size
function updateFontSizeDisplay(size) {
  const displayButton = document.getElementById("font-size-display");
  const percentage = Math.round((size / 16) * 100); // Assuming 16px is default size
  displayButton.textContent = percentage + "%";
}


// Toggle high contrast mode and store in cookie
function toggleContrast() {
  document.body.classList.toggle('high-contrast');
  const isHighContrast = document.body.classList.contains('high-contrast');
  setCookie('highContrast', isHighContrast, 1); // Store high contrast state for 1 hour
}

// Function to load settings from cookies
function loadSettings() {
  const fontSize = getCookie('fontSize');
  const highContrast = getCookie('highContrast');

  if (fontSize) {
    document.documentElement.style.fontSize = fontSize + "px";
    updateFontSizeDisplay(parseFloat(fontSize));
  }

  if (highContrast === 'true') {
    document.body.classList.add('high-contrast');
  }
}

window.onload = loadSettings;

///////////// overview //////////////////

function timeDifference(storedTime) {
  const now = new Date();
  const time = new Date(storedTime); // Convert input string to Date object
  const diffMs = now - time; // Difference in milliseconds

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
      return `Updated ${diffSeconds} second${diffSeconds === 1 ? '' : 's'} ago`;
  } else if (diffMinutes < 60) {
      return `Updated ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
      return `Updated ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
      return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
}


function GetOverview() {
  return $.ajax({
      url: "https://diet-api-dm7h.onrender.com/overview",
      type: "GET",
      success: function(overview) {
          $('#total-views').html(String(overview.total_views));
          $('#last-updated').html(timeDifference(overview.last_updated));
      },
      error: function(error) {
          console.error("Error:", error);
          return null;
      }
  });
}

// Custom function to handle new user logic
function NewUser() {
  const url = "https://diet-api-dm7h.onrender.com/overview/new_user"; // URL for PostUser endpoint
  
  fetch(url, {
      method: "PUT", // Use "POST" if you're sticking with POST
      headers: {
          "Content-Type": "application/json",
      }
  })
  .then(response => response.json())
  .then(data => {
      console.log("Success:", data);
  })
  .catch((error) => {
      console.error("Error:", error);
  });
}

////////////////// alert ///////////////////////////

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