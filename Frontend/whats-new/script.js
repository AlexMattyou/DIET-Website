$(document).ready(function() {

    // Event delegation for dynamically added elements
    $('#accordion').on('click', '.toggle-collapse', function () {
        console.log(".toggle-collapse");
        var target = $(this).data('target');
        $('.collapse').not(target).collapse('hide'); // Close other panels
        $(target).collapse('toggle'); // Toggle the clicked panel
    });

    console.log('ready');
    GetUpdatesData();
    GetActivityData();

    $(document).on('click', '.view-file-btn', function () {
        const originalFileUrl = $(this).data('file');
        const fileInfo = extractFileInfo(originalFileUrl); // Extracts the file ID and type
        if (fileInfo.id) {
            const embedUrl = `https://drive.google.com/file/d/${fileInfo.id}/preview`
            $('#fileViewFrame').attr('src', embedUrl);
            $('#viewBoxModal').modal('show');
        } else {
            console.log('Unable to extract the file ID. Please check the URL.');
        }
    });
});

// Function to extract the Google Drive file ID and type
function extractFileInfo(url) {
    const parts = url.split('/'); // Split URL by '/'
    const id = parts[parts.length - 1];  // The second-last part is the file ID
    const type = parts[parts.length - 0];  // The last part is the type (like 'view')
    return { id, type };  // Return file ID and type as an object
}

function AddUpdateCard(update){
    const container = $('#accordion');
    let element = `
    <div class="card mb-3 shadow">
        <div class="card-header toggle-collapse d-flex justify-content-between" data-target="#u-${update._id}">
            <div class="d-flex">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-down mr-2 mt-1" viewbox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                </svg>
                <h5 class="mb-0">${update.name}</h5>
            </div>
            <p class="mb-n1 font-italic font-weight-light">${timeDifference(update.time)}</p>
        </div>
        <div id="u-${update._id}" class="collapse">
            <div class="card-body d-flex flex-column">
                <p class="mr-3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>${update.desc}</span>&nbsp; &nbsp;</p>
                <button class="btn btn-outline-primary text-nowrap align-self-end pl-4 pr-4 view-file-btn" data-file="${update.file}">View Attached File</button>
            </div>
        </div>
    </div>
    `;
    container.append(element);
}


function GetUpdatesData(){
    console.log("Running -> GetUpdatesData()");
    const url = `https://diet-api-dm7h.onrender.com/latest-updates`;

    $.get(url, function (data) {
        const container = $('#accordion');
        container.empty();
        data.forEach(updates => {
            console.log(updates);
            AddUpdateCard(updates);
        });
    });
}


$(document).ready(function() {

    // Event delegation for dynamically added elements
    $('#accordion').on('click', '.toggle-collapse', function () {
        console.log(".toggle-collapse");
        var target = $(this).data('target');
        $('.collapse').not(target).collapse('hide'); // Close other panels
        $(target).collapse('toggle'); // Toggle the clicked panel
    });

    console.log('ready');
    GetUpdatesData();

    $(document).on('click', '.view-file-btn', function () {
        const originalFileUrl = $(this).data('file');
        const fileInfo = extractFileInfo(originalFileUrl); // Extracts the file ID and type
        if (fileInfo.id) {
            const embedUrl = `https://drive.google.com/file/d/${fileInfo.id}/preview`
            $('#fileViewFrame').attr('src', embedUrl);
            $('#viewBoxModal').modal('show');
        } else {
            aleconsole.log('Unable to extract the file ID. Please check the URL.');
        }
    });
});

////////////////////// for events ////////////////

function ReturnTimeData(data) {
    let [hours, minutes] = data.split(":").map(Number);

    let period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

function ReturnDateData(data) {
    // Split the date string into day, month, and year
    let [day, month, year] = data.split("-");
    
    // Convert the month number to the month name
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Return an array with the formatted day, month name, and year
    return [parseInt(day).toString(), monthNames[parseInt(month) - 1], year];
}

function AddBetaActivityCard(activity) {
    let element = `
    <div class="col-md-3 mb-4">
        <div class="card h-100 border-0 shadow-sm">
            <a href="${activity.image || '#'}" target="_blank">
                <img src="${activity.image || 'https://diettuty.onrender.com/data/img/empty-file.svg'}" class="card-img-top img-fluid" alt="Flyer" style="border-radius: 10px;">
            </a>
        </div>
    </div>
    `;
    const container = $('#activity-container-beta');
    container.append(element);
}


function AddActivityCard(activity){
    let date_data = ReturnDateData(activity.event_date)
    let time_data = ReturnTimeData(activity.event_time)
    let element = `
    <div class="d-flex flex-md-row event-box flex-column shadow mb-4 border bg-light" style="width: 100%; max-width: 900px; border-radius: 10px;">
    <!-- Image Column -->
    <div class="col-md-4 p-0 m-0 no-mobile">
      <img src="${activity.image || 'https://diettuty.onrender.com/data/img/empty-file.svg'}" class="img-fluid" style="width: 100%; height: auto; border-top-left-radius: 10px; border-bottom-left-radius: 10px;" alt="Flyer">
    </div>
    <!-- Content Column -->
    <div class="col-md-8 p-3 d-flex flex-column justify-content-between col-12">
      <div>
        <h3 class="text-secondary event-title mt-n1 font-weight-bold">${activity.name}</h3>
        <p class="activity-description">${activity.desc}</p><a class="btn btn-outline-primary" target="_blank" href="${activity.image}">View File</a>
      </div>
      <div class="event-date-time mt-3 d-flex align-items-end justify-content-start">
        <div class="date-box border me-2 text-center pt-2 pb-2 pl-4 pr-4 mr-3 rounded bg-secondary text-light">
          <h2 class="m-0">${date_data[2]}</h2>
          <p class="mb-n1">${date_data[1]} ${date_data[0]}</p>
        </div>
        <div class="time-box p-2 text-center rounded text-secondary d-flex flex-column align-items-start justify-content-between">
          <strong class="mb-2">Venue: auditorium</strong><strong>Time: ${time_data}</strong>
        </div>
      </div>
    </div>
  </div>
    `;
    const container = $('#activity-container');
    container.append(element);
}


function GetActivityData(){
    console.log("Running -> GetUpdatesData()");
    const url = `https://diet-api-dm7h.onrender.com/activity`;

    $.get(url, function (data) {
        $('#activity-container').empty();
        $('#activity-container-beta').empty();
        data.forEach(activity => {
            console.log(activity);
            AddActivityCard(activity);
            AddBetaActivityCard(activity)
        });
    });
}
