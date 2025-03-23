function generateCarousel() {
  const imagesPath = './data/highlights/';
  const images = ['0001.png', '0002.png', '0003.png', '0004.png'];
  const carouselInner = $('#carouselContent');
  const carouselIndicators = $('#carouselIndicators');
  
  images.forEach((img, index) => {
      const isActive = index === 0 ? 'active' : '';
      
      // Create carousel item
      const carouselItem = `
          <div class="carousel-item ${isActive}">
              <img src="${imagesPath}${img}" class="d-block w-100" alt="Image ${index + 1}">
          </div>
      `;
      carouselInner.append(carouselItem);
      
      // Create indicator dot
      const indicatorItem = `
          <li data-target="#carouselExample" data-slide-to="${index}" class="${isActive} no-mobile"></li>
      `;
      carouselIndicators.append(indicatorItem);
  });
}

$(document).ready(function() {
  generateCarousel();
});

function animateCounter(id, start, end, duration) {
  let current = start;
  const increment = end > start ? 1 : -1; // Determine the direction
  const stepTime = Math.abs(Math.floor(duration / (end - start)));

  const obj = document.getElementById(id);

  const timer = setInterval(() => {
    current += increment;
    obj.innerHTML = current.toLocaleString(); // Add comma formatting (e.g., 1,000)

    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      clearInterval(timer);
    }
  }, stepTime);
}

function runCounter() {
  return $.ajax({
      url: "https://diettutapi.onrender.com/overview",
      type: "GET",
      success: function(overview) {
          $('#total-views').html(String(overview.total_views));
          animateCounter("total-views-big", 0, overview.total_views, 1500); // Animate for 2 seconds
      },
      error: function(error) {
          console.error("Error:", error);
          return null;
      }
  });
}


$(document).ready(function() {
  runCounter()
});