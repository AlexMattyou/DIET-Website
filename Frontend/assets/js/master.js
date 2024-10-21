$(document).ready(function() {
  
});


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

///////////// change language //////////////////
