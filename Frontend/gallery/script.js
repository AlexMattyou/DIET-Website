$(document).ready(function() {
    
    GetYearData();

    $('#yearSelector').on('change', function() {
        $('#picture-container').empty();
        $('#video-container').empty();
        var selectedYear = $(this).val();
        var selectedYearText = $(this).find('option:selected').text();
        UpdateEventList(selectedYearText, selectedYear)
        console.log('Year selected: ' + selectedYearText + ', ID: ' + selectedYear);
    });

});

///////////////////// lightbox /////////////////////////////

///////////// functions ///////////////////////

function ShowInsideEvent(year_id, event_id) {
    
    $('#data-container').removeClass('d-none');
    LoadMetaData(year_id, event_id);
    LoadPhotos(year_id, event_id);
    LoadVideos(year_id, event_id);
    
    
    const targetElement = document.getElementById("event-headline"); // Replace with the actual ID of your target element
    targetElement.scrollIntoView({ behavior: "smooth" });
}

function GetYearData() {
    const url = "http://127.0.0.1:5879/gallery/years";  // API endpoint

    $.get(url, function (data) {
        const container = $('#yearSelector');
        container.empty();
        data.forEach(years => {
            let element = `<option value="${years._id}" selected>${years.year}</option>`;
            container.append(element);
        });


        // Select the last option
        container.val(container.find('option:last').val());  // Select the last option
        const selectedYear = container.val();  // Get the selected value
        const selectedYearText = container.find('option:selected').text();  // Get the selected text
        
        // Now call UpdateEventList with the selected year
        UpdateEventList(selectedYearText, selectedYear);
        console.log('Year selected: ' + selectedYearText + ', ID: ' + selectedYear);
    });
}

function UpdateEventList(year_name, year_id){
    console.log('Year selected:', year_name);
    console.log('Year ID:', year_id);

    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events`;

    $.get(url, function (data) {
        console.log(data)
        var container = $('#event-container');
        container.empty();

        data.forEach(event => {
            let element = `
            <div class="box p-3 col-md-4 col-xl-3 col-12 d-flex flex-column align-items-center p-0" onclick="ShowInsideEvent('${year_id}', '${event._id}')" style="height: 400px; width: 200px">
		<div class="box-content image-container position-relative w-100" style="height: 10000px; background-image: url('${event.image || '../data/img/empty-file.svg'}'); background-size: cover; background-position: center center; border-radius: 10px;">
		</div><br>
      <h5 class="text-center mt-2 font-weight-bolder">${event.name || ' '}</h5>
    </div>
            `
            container.append(element)
        });
    });
}

function LoadMetaData(year_id, event_id){

    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`;

    $.get(url, function (data) {
        $('#event-headline').html(data.name)
        $('#event-description').html(data.info)
    });
}

function LoadPhotos(year_id, event_id){
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`;

    $.get(url, function (data) {
        console.log(data)
        var container = $('#picture-container');
        container.empty();

        data.photos.forEach(photos => {
            let element = `
            <div class="img-gallery__item round p-0" style="border-radius: 20px;">
                <figure>
                    <img src="${photos.image}" alt="A Gallery Image" class="img-thumbnail gallery-img round m-0 border-0" data-bs-toggle="modal" data-bs-target="#lightboxModal">
                </figure>
            </div>
            `
            if (photos.image){
                container.append(element)
            }
        });

        const galleryImgs = document.querySelectorAll('.gallery-img');
        const lightboxImg = document.getElementById('lightboxImg');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        let currentIndex = 0;

        // Event listener for opening the modal and setting the initial image
        galleryImgs.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentIndex = index;
                lightboxImg.src = img.src;
            });
        });

        // Navigation for Previous and Next buttons
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? galleryImgs.length - 1 : currentIndex - 1;
            lightboxImg.src = galleryImgs[currentIndex].src;
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === galleryImgs.length - 1) ? 0 : currentIndex + 1;
            lightboxImg.src = galleryImgs[currentIndex].src;
        });

    });
}

function LoadVideos(year_id, event_id){
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`;

    $.get(url, function (data) {
        console.log(data)
        var container = $('#video-container');
        container.empty();

        data.videos.forEach(videos => {
            var e_link = EmbedYouTube(videos.video)
            let element = `
            <iframe width="448" height="252 " src="${e_link}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="m-3 align-self-center"></iframe>
            `
            if (e_link){
                container.append(element)
            }
        });
    });
}

function EmbedYouTube(link) {
    let videoId;

    // Handle the different YouTube URL formats
    if (link.includes("youtu.be")) {
        // Shortened URL: https://youtu.be/KoIPEbfU4mo
        videoId = link.split('/').pop().split('?')[0];
    } else if (link.includes("youtube.com/watch")) {
        // Standard or mobile URL: https://www.youtube.com/watch?v=KoIPEbfU4mo
        videoId = new URLSearchParams(new URL(link).search).get('v');
    // } else if (link.includes("youtube.com/embed")) {
    //     // Already an embed URL: https://www.youtube.com/embed/KoIPEbfU4mo
    //     return link; // No modification needed
    // }
    }else{
        return link;
    }

    // Return the formatted embed URL
    return `https://www.youtube.com/embed/${videoId}`;
}
