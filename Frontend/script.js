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

