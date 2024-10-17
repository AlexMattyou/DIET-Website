// Get the navbar element
const navbar = document.getElementById("navbar");

// Get the offset position of the navbar
const sticky = navbar.offsetTop;

// Add scroll event listener
window.onscroll = function() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky"); // Add sticky class when you scroll past it
  } else {
    navbar.classList.remove("sticky"); // Remove sticky class when you scroll back up
  }
};