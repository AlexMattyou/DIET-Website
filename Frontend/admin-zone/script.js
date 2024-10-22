$(document).ready(function () {

    GetYearData();
    GetTeamData();
    GetUpdateData();
    GetActivityData();
    GetResearchData();
    GetNewsletterData()

    DataTabSwitch();

    $('#year-select').on('change', function() {
        $('#photos-edit-container').empty();
        $('#videos-edit-container').empty();
        var selectedYear = $(this).val();
        var selectedYearText = $(this).find('option:selected').text();
        UpdateEventChoices(selectedYearText, selectedYear)
        console.log('Year selected: ' + selectedYearText + ', ID: ' + selectedYear);
    });

        $('#event-select').on('change', function() {
        var selectedEvent = $(this).val();
        var selectedYear = $('#year-select').val();
        var selectedEventText = $(this).find('option:selected').text();
        console.log('Event selected: ' + selectedEventText + ', ID: ' + selectedEvent);
        GetPhotoEditor(selectedYear, selectedEvent);
        GetVideoEditor(selectedYear, selectedEvent);
    });
      
});

function DataTabSwitch(){
    console.log("haha");

    UpdateYearChoices()
}

function UploadShowImage(event, the_id, parentFolder, other_id1 = '', other_id2 = '', new_one = false) {

    
    let imageInput;
    // Get the image input element and the preview image element
    if (new_one){
        imageInput = document.getElementById(`imageInput-new`);
    }else{
        imageInput = document.getElementById(`imageInput-${the_id}`);
    }
    const imagePreview = document.getElementById(`imagePreview-${the_id}`);
    
    // Set the image preview to a spinner while the upload is in progress
    imagePreview.src = '../data/img/spinner.svg';

    // Get the selected file
    const file = imageInput.files[0];
    if (!file) {
        return; // No file selected
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('placeID', the_id); // Pass the teamId as placeID
    formData.append('otherID1', other_id1);
    formData.append('otherID2', other_id2);

    console.log([...formData.entries()]);

    // Perform the AJAX request to upload the file
    $.ajax({
        url: 'http://127.0.0.1:5879/drive/'+parentFolder, // Your API endpoint
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            // Update the preview image with the uploaded image link
            imagePreview.src = response.link;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle errors by reverting to the default image
            imagePreview.src = '../data/img/upload.png';
            console.error('Upload error:', textStatus, errorThrown);
        }
    });
}

function UploadFile2Drive(event, the_id, parentFolder) {
    console.log(the_id, parentFolder);
    
    // Get the file input and preview elements using jQuery
    const fileInput = $(`#fileInput-${the_id}`).get(0);  // Access the raw DOM element
    const filePreview = $(`#filePreview-${the_id}`);
    
    // Set the image preview to a spinner while the upload is in progress
    filePreview.html('Loading...');

    // Get the selected file from the file input
    const file = fileInput.files[0];  // Access the files array from the raw DOM element
    console.log(file);
    if (!file) {
        filePreview.html('Click to select file 👆');
        console.log("no file selected");
        return; // No file selected
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('placeID', the_id); // Pass the teamId as placeID

    console.log([...formData.entries()]);

    // Perform the AJAX request to upload the file
    $.ajax({
        url: 'http://127.0.0.1:5879/drive/' + parentFolder, // Your API endpoint
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            // Update the preview image with the uploaded image link
            filePreview.html("File uploaded Successfully ✅");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Handle errors by reverting to the default image
            filePreview.html("Error uploading file ‼️");
            console.error('Upload error:', textStatus, errorThrown);
        }
    });
}

// Fetch and display data using jQuery
function GetTeamData() {
    const url = "http://127.0.0.1:5879/team";  // API endpoint

    $.get(url, function (data) {
        let teachTeamHtml = '';
        let nonTeachTeamHtml = '';

        // const imageURL = team.image
        // const image = imageElement ? imageElement.value : "https://diettuty.onrender.com/data/img/no-profile.jpg";

        // Loop through the team data
        data.forEach(team => {
            let teamHtml = `
                <div id="${team._id}" class="col-md-6 p-2">
                    <div class="border p-3 color-container">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <!-- Image URL Input -->
                                <div class="image-preview-container" onclick="document.getElementById('imageInput-${team._id}').click()">
                                    <img id="imagePreview-${team._id}"  class="image-preview img-fluid mt-3"  
                                        src="${team.image || '../data/img/upload.png'}" 
                                        alt="Team member image preview">
                                    <input type="file" id="imageInput-${team._id}" accept="image/*" 
                                        onchange="UploadShowImage(event,'${team._id}', 'our-team')" style="display:none;"> 
                                </div>

                            </div>

                            <div class="col-md-8">
                                <input type="text" class="form-control mb-3 team-name" value="${team.name || ''}" placeholder="Name">
                                <input type="text" class="form-control mb-3 team-designation" value="${team.designation || ''}" placeholder="Designation">
                                <textarea class="form-control mb-3 team-address" placeholder="Address">${team.address || ''}</textarea>
                                <!-- Phone Numbers -->
                                <div class="row">
                                    <div class="col-md-6">
                                        <input type="text" class="form-control mb-3 team-phone1" value="${team.phone1 || ''}" placeholder="Phone 1">
                                    </div>
                                    <div class="col-md-6">
                                        <input type="text" class="form-control mb-3 team-phone2" value="${team.phone2 || ''}" placeholder="Phone 2">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end gap-3">
                            <button type="button" class="btn btn-outline-info mark-button team-update me-2 mr-1" onClick="UpdateTeam('${team._id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"/>
                                    <path fill-rule="evenodd"
                                        d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"/>
                                </svg>
                                Update
                            </button>
                            <button type="button" class="btn btn-outline-danger mark-button team-delete" onClick="DeleteTeam('${team._id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;

            if (team.teaching === 'yes') {
                teachTeamHtml += teamHtml;
            } else {
                nonTeachTeamHtml += teamHtml;
            }
        });

        let addNewTeamHtmlTeaching = `
            <div class="col-md-6 p-2">
                <button class="d-flex justify-content-center align-items-center border p-3 h-100 w-100 alert-success" onClick="CreateTeam('yes')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="var(--success)" class="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
            </div>
        `;

        let addNewTeamHtmlNonTeaching = `
            <div class="col-md-6 p-2">
                <button class="d-flex justify-content-center align-items-center border p-3 h-100 w-100 alert-success" onClick="CreateTeam('no')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="var(--success)" class="bi bi-plus-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                    </svg>
                </button>
            </div>
        `;

        // Append to the HTML elements
        document.getElementById('teaching_team').innerHTML = teachTeamHtml + addNewTeamHtmlTeaching || '';
        document.getElementById('non_teaching_team').innerHTML = nonTeachTeamHtml + addNewTeamHtmlNonTeaching || '';
    });
}

function CreateTeam(t){
    // Prepare the data to send
    const teamData = {
        name: "New Name",
        teaching: t
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/team", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(teamData), // Convert JS object to JSON string
        success: function(response) {
            console.log("Team created successfully:", response);
            // Optionally, you can refresh the team list or display a success message here
        },
        error: function(xhr, status, error) {
            console.error("Failed to create team:", error);
        }
    });

    // clear the container
    $('#all-team-container').empty();

    //load again
    setTimeout(GetTeamData, 200);

}

function DeleteTeam(teamID) {
    // Confirm if the user really wants to delete the team
    const confirmation = confirm("Are you sure you want to delete this team member?");

    if (confirmation) {
        // Find the team element on the screen
        const teamElement = document.getElementById(teamID);

        if (teamElement) {
            // Make an AJAX DELETE request to delete the team from the database
            $.ajax({
                url: `http://127.0.0.1:5879/team/${teamID}`,  // API URL with the teamID
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("Team deleted successfully:", response);
                    
                    // Remove the team element from the DOM after successful deletion
                    teamElement.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete team:", error);
                }
            });
        } else {
            console.error("Team element not found for ID:", teamID);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function UpdateTeam(teamID) {
    // Find the team element with the given id
    const teamElement = document.getElementById(teamID);

    if (teamElement) {
        // Find the input elements inside this specific team box
        const name = teamElement.querySelector('.team-name').value;
        const designation = teamElement.querySelector('.team-designation').value;
        const address = teamElement.querySelector('.team-address').value;
        const phone1 = teamElement.querySelector('.team-phone1').value;
        const phone2 = teamElement.querySelector('.team-phone2').value;

        // const imageElement = teamElement.querySelector('.image-url-input');
        // const image = imageElement ? imageElement.value : "https://diettuty.onrender.com/data/img/no-profile.jpg"; // Image URL input
        // const imagePreview = teamElement.querySelector('.image-preview');
        // imageElement.src = image;


        // Prepare the data in the required format
        const teamData = {
            name: name,
            designation: designation,
            address: address,
            phone1: phone1,
            phone2: phone2
            // image: image
        };

        // Log the data for checking
        console.log("Data to be updated:", teamData);

        // Now make an AJAX PUT request to update the team
        $.ajax({
            url: `http://127.0.0.1:5879/team/${teamID}`,  // API URL with the teamID
            type: "PUT",  // Request method for updating
            data: JSON.stringify(teamData),  // Send the team data as JSON
            contentType: "application/json",  // Set content type as JSON
            success: function(response) {
                console.log("Team updated successfully:", response);
                // Optionally show a success message or update the UI further
            },
            error: function(xhr, status, error) {
                console.error("Failed to update team:", error);
            }
        });
    } else {
        console.error("Team element not found for ID:", teamID);
    }
}


// Gallery 

function CreateYear() {
    year_input = $('#new-year-input').val();
    // Prepare the data to send
    const teamData = {
        year: year_input
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/gallery/years", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(teamData), // Convert JS object to JSON string
        success: function(response) {
            // Extract the _id from the response and store it in the year_id variable
            const year_id = response._id;
            console.log("Year created successfully. ID:", year_id);
            // You can use the year_id variable as needed here

            AddYearBlock(year_id, year_input);
        },
        error: function(xhr, status, error) {
            console.error("Failed to create year:", error);
        }
    });
}

function AddYearBlock(the_id, year_input) {
    // Create the HTML block using template literals
    const yearBlock = `
    <div id="year-button-${the_id}" class="year-button-container d-flex">
      <button class="btn btn-outline-primary year-button" onClick="DisplayEventOfYear('${the_id}')">${year_input}</button> 
      <button class="btn btn-outline-danger svg-buttons" onClick="DeleteYear('${the_id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
      </button>
    </div>
    `;

    // Append the newly created block to the container
    $('#year-select-container').append(yearBlock);
}

function GetYearData() {
    const url = "http://127.0.0.1:5879/gallery/years";  // API endpoint

    $.get(url, function (data) {

        data.forEach(years => {
            AddYearBlock(years._id, years.year);
        });
    });
}

function DeleteYear(year_id) {
    // Confirm if the user really wants to delete the team
    const confirmation = confirm("Are you sure? Deleting this will also removes album, images, videos inside this!");

    if (confirmation) {
        // Find the team element on the screen
        elementID = "year-button-" + year_id
        const element = document.getElementById(elementID);

        if (element) {
            // Make an AJAX DELETE request to delete the team from the database
            $.ajax({
                url: `http://127.0.0.1:5879/gallery/years/${year_id}`,  // API URL with the teamID
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("Team deleted successfully:", response);
                    
                    // Remove the team element from the DOM after successful deletion
                    element.remove();
                    $('#new-event-button-container').empty();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete team:", error);
                }
            });
        } else {
            console.error("Element not found for ID:", elementID);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function DisplayEventOfYear(year_id) {
    // Update button classes as needed
    $('.year-button-container .year-button').removeClass('btn-primary').addClass('btn-outline-primary');
    $('#year-button-' + year_id + ' .year-button').removeClass('btn-outline-primary').addClass('btn-primary');

    const url = "http://127.0.0.1:5879/gallery/years/" + year_id;

    $.get(url, function (data) {
        if (data && data.events) {
            console.log(data.events);
            $('#event-edit-container').empty(); // Clear the previous event blocks
            UpdateNewEventButton(year_id); // Update the new event button with the year ID

            // Loop through the events and add each event block
            data.events.forEach(event => {
                console.log(event.image); // Log the image for debugging
                AddEventBlock(event._id, year_id, event.name, event.info, event.image); // Use fetched event data
            });
        } else {
            console.error("No events found for this year.");
        }
    }).fail(function (err) {
        console.error("Error fetching events for the year:", err);
    });
}

function AddEventBlock(event_id, year_id, event_name = '', event_desc = '', event_image = '') {
    console.log(event_image)
    console.log('running')
    // Create the HTML block using template literals
    const eventBlock = `
    <div id="event-block-${event_id}" class="row border rounded p-3 shadow-sm mb-2">
        <!-- Image Preview Section -->
        <div class="d-flex justify-content-center align-items-center col-12 mb-2 col-md-4 col-xl-4">
          <div class="image-preview-container" onclick="document.getElementById('imageInput-${event_id}').click()">
            <img id="imagePreview-${event_id}" class="image-preview img-fluid w-100" src="${event_image || '../data/img/upload.png'}" alt="Event image preview"/>
            <input type="file" id="imageInput-${event_id}" accept="image/*" onchange="UploadShowImage(event, '${event_id}', 'gallery-event', '${year_id}')" style="display:none;"> 
          </div>
        </div>

        <!-- Event Details Section -->
        <div class="col-12 col-xl-8 col-md-8">
          <div class="row mb-3">
            <div class="col-12">
              <input id="event-name-${event_id}" type="text" class="form-control w-100 mb-n2" id="eventName" placeholder="Event name" value="${event_name}">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-12">
              <textarea id="event-info-${event_id}" class="form-control w-100 mb-n2" rows="4" placeholder="Description">${event_desc}</textarea>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="d-flex justify-content-end">
            <button class="btn btn-outline-info me-2 mr-1" onClick="UpdateEvent('${event_id}', '${year_id}')">Save</button>
            <button class="btn btn-outline-danger" onClick="DeleteEvent('${event_id}', '${year_id}')">Delete</button>
          </div>
        </div>
      </div>
    `;

    // Append the newly created block to the container
    $('#event-edit-container').append(eventBlock);

}

function UpdateNewEventButton(year_id){
    newEventButton = `
    <button id="add-new-event-button" class="d-flex justify-content-center align-items-center p-3 h-100 w-100 alert-success border-0" onclick="CreateEvent('${year_id}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="var(--success)" class="bi bi-plus-square" viewbox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
      </button>
    `
    $('#new-event-button-container').html(newEventButton);
}

function CreateEvent(year_id) {
    const eventData = {
        name: ''
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/gallery/years/"+ year_id +"/events", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(eventData), // Convert JS object to JSON string
        success: function(response) {
            const event_id = response._id;
            console.log("Event created successfully. ID:", event_id);

            AddEventBlock(event_id, year_id);
        },
        error: function(xhr, status, error) {
            console.error("Failed to create year:", error);
        }
    });
}

function DeleteEvent(event_id, year_id) {
    // Confirm if the user really wants to delete the event
    const confirmation = confirm("Are you sure you want to delete this Event?");

    if (confirmation) {
        // Find the event element on the screen
        const eventElement = $('#event-block-' + event_id);

        if (eventElement.length > 0) {
            // Make an AJAX DELETE request to delete the event from the database
            $.ajax({
                url: `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`,  // API URL with yearId and eventId
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("Event deleted successfully:", response);
                    
                    // Remove the event element from the DOM after successful deletion
                    eventElement.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete event:", error);
                    console.error("Server response:", xhr.responseText);  // Log detailed server response
                }
            });
        } else {
            console.error("Event element not found for ID:", event_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function UpdateEvent(event_id, year_id){
    const eventData = {
        name: $('#event-name-' + event_id).val(),
        info: String($('#event-info-' + event_id).val())
    };

    console.log(eventData)
    $.ajax({
        url: `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`, // API URL
        type: "PUT",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(eventData), // Convert JS object to JSON string
        success: function(response) {
            console.log("Event updated successfully:", response);
            
        },
        error: function(xhr, status, error) {
            console.error("Failed to update event:", error);
        }
    });
}

function UpdateYearChoices(){
    const url = "http://127.0.0.1:5879/gallery/years";

    $.get(url, function (data) {
        console.log(data)
        var yearDatalist = $('#year-select');
        yearDatalist.empty(); // Clear existing options
        yearDatalist.append(`<option value="" disabled selected>Select Year</option>`)

        data.forEach(years => {
            let element = `<option value="${years._id}">${years.year}</option>`
            yearDatalist.append(element)
        });
    });
}

function UpdateEventChoices(selectedYear, yearId){
    console.log('Year selected:', selectedYear);
    console.log('Year ID:', yearId);

    const url = `http://127.0.0.1:5879/gallery/years/${yearId}/events`;

    $.get(url, function (data) {
        console.log(data)
        var eventDatalist = $('#event-select');
        eventDatalist.empty(); // Clear existing options
        eventDatalist.append(`<option value="" disabled selected>Select Event</option>`)

        data.forEach(event => {
            let element = `<option value="${event._id}">${event.name}</option>`
            eventDatalist.append(element)
        });
    });

    return yearId;
}

function AddNewPhoto(year_id, event_id) {
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}/photos`;

    // Send an empty request to generate a new photo
    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            image: "" // Empty image for ID generation
        }),
        success: function(newPhoto) {
            // Log the new photo object or retrieve the new photo's ID
            console.log("New Photo Created:", newPhoto);
            const photoId = newPhoto._id; // Accessing the newly created photo's ID
            console.log("Newly created photo ID:", photoId);

            // Call functions using the new photo ID
            AddPhoto(photoId, '', year_id, event_id);
            $('#new-photo-item').prop('disabled', true);
            UploadShowImage(event, photoId, 'gallery-images', year_id, event_id, true);
            $('#new-photo-item').remove();
            NewPhotoFrame(year_id, event_id)
            $('#new-photo-item').prop('disabled', false);
        },
        error: function(xhr, status, error) {
            console.error("Error creating new photo:", error);
        }
    });
}


function NewPhotoFrame(year_id, event_id){
    let element = `
        <div id="new-photo-item" class="photo-item p-2 mr-2 d-flex flex-column h-100 justify-content-between align-items-center">
                      <div class="image-preview-container" onclick="document.getElementById('imageInput-new').click()">
                        <img id="imagePreview-new" class="image-preview img-fluid mt-3" src="../data/img/upload.png">
                        <input type="file" id="imageInput-new" accept="image/*"
                          onchange="AddNewPhoto('${year_id}', '${event_id}')" style="display:none;">
                      </div>
                    </div>
    `;
    $("#photos-edit-container").prepend(element);
}

function GetPhotoEditor(year_id, event_id) {
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`;

    $.get(url, function (data) {
        $("#photos-edit-container").empty()
        NewPhotoFrame(year_id, event_id)
        if (data && data.photos && data.photos.length > 0) {
            data.photos.forEach(photo => {
                AddPhoto(photo._id, photo.image, year_id, event_id)
            });
        } else {
            console.log("No photos found for this event.");
        }
    }).fail(function (error) {
        console.log("Error fetching data: ", error);
    });
}

function AddPhoto(photo_id, photo_image, year_id, event_id){
    let element = `
                <div class="photo-item-container">
    <div class="photo-item p-2 mr-2 border round d-flex flex-column">
        <div class="image-preview-container" onclick="document.getElementById('imageInput-${photo_id}').click()">
            <img width="100em" id="imagePreview-${photo_id}" class="image-preview img-fluid mt-3" src="${photo_image || '../data/img/upload.png'}">
            <input type="file" id="imageInput-${photo_id}" accept="image/*" onchange="UploadShowImage(event, '${photo_id}', 'gallery-images', '${year_id}', '${event_id}')" style="display:none;">
        </div>
        <button onClick="DeletePhoto('${year_id}', '${event_id}', '${photo_id}')" type="button" class="btn btn-outline-danger mt-3 w-100">Delete</button>
    </div>
</div>

                `
                $("#photos-edit-container").append(element)
}

function DeletePhoto(year_id, event_id, photo_id){

    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}/photos/${photo_id}`;

    const confirmation = confirm("Are you sure you want to remove this photo?");

    if (confirmation) {
        // Find the event element on the screen
        const element = $('#imagePreview-' + photo_id).parent().parent();

        if (element.length > 0) {
            // Make an AJAX DELETE request to delete the event from the database
            $.ajax({
                url: url,  // API URL with yearId and eventId
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("Photo deleted successfully:", response);
                    
                    // Remove the event element from the DOM after successful deletion
                    element.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete photo:", error);
                    console.error("Server response:", xhr.responseText);  // Log detailed server response
                }
            });
        } else {
            console.error("Event element not found for ID:", event_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function NewVideoButton(year_id, event_id){
    let element = `
                <div id="new-video-button-container" class="p-2 col-md-12 border alert-success rounded mb-2"
                      style="height: 80px;">
                      <button id="add-new-event-button"
                        class="d-flex justify-content-center align-items-center p-3 h-100 w-100 alert-success border-0"
                        onclick="CreateVideo('${year_id}', '${event_id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="var(--success)"
                          class="bi bi-plus-square" viewbox="0 0 16 16">
                          <path
                            d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z">
                          </path>
                          <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4">
                          </path>
                        </svg>
                      </button>
                    </div>

                `
                $("#video-edit-container").prepend(element)
}

function CreateVideo(year_id, event_id){
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}/videos`;

    // Send an empty request to generate a new photo
    $.ajax({
        url: url,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            video: "" // Empty image for ID generation
        }),
        success: function(newVideo) {
            console.log(newVideo)
            console.log("Newly created video ID:", newVideo._id);

            // Call functions using the new photo ID
            AddVideo(year_id, event_id, newVideo._id);
        },
        error: function(xhr, status, error) {
            console.error("Error creating new video:", error);
        }
    });
}

function GetVideoEditor(year_id, event_id) {
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}`;

    container = $('#video-edit-container')
    container.empty()
    NewVideoButton(year_id, event_id)

    $.get(url, function (data) {
        if (data && data.videos && data.videos.length > 0) {
            data.videos.forEach(video => {
                console.log(video)
                AddVideo(year_id , event_id, video._id, video.video)
            });
        } else {
            console.log("No videos found for this event.");
        }
    }).fail(function (error) {
        console.log("Error fetching data: ", error);
    });
}

function AddVideo(year_id, event_id, video_id, link=''){
    let element = `
        <div id="video-block-${video_id}" class="video-edit-container d-flex mb-1">
                          <input id="video-input-${video_id}" type="text" class="new-video-input form-control ml-auto" placeholder="Paste your YouTube link" value="${link}"><button class="btn svg-buttons btn-outline-info" onclick="UpdateVideo('${year_id}','${event_id}','${video_id}')"><span class="no-mobile">
	Update
	</span>
	<span class="no-desktop"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square-fill" viewbox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z"></path>
                                    <path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z"></path>
                                </svg></span>
</button>
	
	<button class="btn svg-buttons btn-outline-danger" onclick="DeleteVideo('${year_id}','${event_id}','${video_id}')"><span class="no-mobile">
	Delete
	</span>
	<span class="no-desktop"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-trash-fill" viewbox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
        </svg></span>
</button>
                          
                        </div>
    `
    $('#video-edit-container').append(element);
}

function UpdateVideo(year_id, event_id, video_id){
    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}/videos/${video_id}`;

    const videoData = {
        video: $('#video-input-' + video_id).val()
    };

    console.log(videoData)
    $.ajax({
        url: url, // API URL
        type: "PUT",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(videoData), // Convert JS object to JSON string
        success: function(response) {
            console.log("Event updated successfully:", response);
            
        },
        error: function(xhr, status, error) {
            console.error("Failed to update event:", error);
        }
    });
}

function DeleteVideo(year_id, event_id, video_id){

    const url = `http://127.0.0.1:5879/gallery/years/${year_id}/events/${event_id}/videos/${video_id}`;

    const confirmation = confirm("Are you sure you want to remove this video?");

    if (confirmation) {
        const element = $('#video-block-' + video_id);

        if (element.length > 0) {
            $.ajax({
                url: url,
                type: "DELETE",
                success: function(response) {
                    console.log("Photo deleted successfully:", response);
                    
                    element.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete video:", error);
                    console.error("Server response:", xhr.responseText);
                }
            });
        } else {
            console.error("Event element not found for ID:", video_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

//////////////////////// Latest Updates //////////////////////////////



function AddUpdatesBlock(update){
    file_link = 'No File Selected❕'
    if (update.file){
        file_link = "File Selected ✅"
    }
    let element = `
    <div id="update-block-${update._id}" class="row border rounded p-3 shadow-sm mb-2 ">
              <!-- Image Preview Section -->
              <div class="d-flex justify-content-center align-items-center col-12 mb-2 col-md-4 col-xl-4">
                <div style="overflow: hidden;" class="file-preview-container break-at-slash" onclick="document.getElementById('fileInput-${update._id}').click()">
                  <h5 id="filePreview-${update._id}" >${file_link}</h5>
                  <input type="file" id="fileInput-${update._id}" accept="image/*, application/pdf"
       onchange="UploadFile2Drive(event, '${update._id}', 'latest-updates')" style="display:none;">
                </div>
              </div>

              <!-- Event Details Section -->
              <div class="col-12 col-xl-8 col-md-8">
                <div class="row mb-3">
                  <div class="col-12">
                    <input id="update-header-${update._id}" type="text" class="form-control w-100 mb-n2" placeholder="Headline"
                      value="${update.name || ''}">
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-12">
                    <textarea id="update-info-${update._id}" class="form-control w-100 mb-n2" rows="4"
                      placeholder="Description">${update.desc || ''}</textarea>
                  </div>
                </div>

                <!-- Buttons -->
                <div class="d-flex justify-content-end">
                  <button class="btn btn-outline-info me-2 mr-1" onclick="UpdateUpdate('${update._id}')">Save</button>
                  <button class="btn btn-outline-danger" onclick="DeleteUpdate('${update._id}')">Delete</button>
                </div>
              </div>
            </div>
    `
    $('#update-edit-container').append(element)
}

function GetUpdateData() {
    const url = "http://127.0.0.1:5879/latest-updates";  // API endpoint

    $.get(url, function (data) {
        $('#update-edit-container').empty()
        data.forEach(update => {
            console.log("update",update)
            AddUpdatesBlock(update)
        });
            
    });
}

function GetSingleUpdate(update_id){
    const url = `http://127.0.0.1:5879/latest-updates/${update_id}`

    $.get(url, function (data) {
        console.log(data);
    });
}

function CreateUpdate(){
    // Prepare the data to send
    const data = {
        name: "",
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/latest-updates", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(data), // Convert JS object to JSON string
        success: function(response) {
            console.log("Update created successfully:", response);
            AddUpdatesBlock(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to create update:", error);
        }
    });

}

function DeleteUpdate(update_id) {
    // Confirm if the user really wants to delete the team
    const confirmation = confirm("Are you sure you want to delete this team member?");

    if (confirmation) {
        // Find the team element on the screen
        const element = $('#update-block-'+update_id)

        if (element) {
            // Make an AJAX DELETE request to delete the team from the database
            $.ajax({
                url: `http://127.0.0.1:5879/latest-updates/${update_id}`,  // API URL with the teamID
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("update deleted successfully:", response);
                    
                    // Remove the team element from the DOM after successful deletion
                    element.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete update:", error);
                }
            });
        } else {
            console.error("update element not found for ID:", update_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function UpdateUpdate(update_id) {
    // Find the team element with the given id
    const element = $('#update-block-'+update_id);

    if (element) {

        
        const data = {
            name: $('#update-header-'+update_id).val(),
            desc: $('#update-info-'+update_id).val(),
        };

        // Log the data for checking
        console.log("Data to be updated:", data);

        // Now make an AJAX PUT request to update the team
        $.ajax({
            url: `http://127.0.0.1:5879/latest-updates/${update_id}`,  // API URL with the teamID
            type: "PUT",  // Request method for updating
            data: JSON.stringify(data),  // Send the team data as JSON
            contentType: "application/json",  // Set content type as JSON
            success: function(response) {
                console.log("Team updated successfully:", response);
                // Optionally show a success message or update the UI further
            },
            error: function(xhr, status, error) {
                console.error("Failed to update team:", error);
            }
        });
    } else {
        console.error("Team element not found for ID:", update_id);
    }
}


///////////////// FC events //////////////

function AddActivityBlock(activity){
    console.log(activity)
    let element = `
    <div id="activity-block-${activity._id}" class="row border rounded p-3 shadow-sm mb-2">
  
  <div class="d-flex justify-content-center align-items-center col-12 mb-2 col-md-4 col-xl-4">
    <div class="image-preview-container" onclick="document.getElementById('imageInput-${activity._id}').click()">
      <img id="imagePreview-${activity._id}" class="image-preview img-fluid w-100" src="${activity.image || 'https://diettuty.onrender.com/data/img/empty-file.svg'}" alt="Event image preview"/>
      <input type="file" id="imageInput-${activity._id}" accept="image/*" onchange="UploadShowImage(event, '${activity._id}', 'activity')" style="display:none;"> 
    </div>
  </div>

  <div class="col-12 col-xl-8 col-md-8">
    <div class="row mb-3">
      <div class="col-12">
        <input id="activity-name-${activity._id}" type="text" class="form-control w-100 mb-n2" placeholder="Event name" value="${activity.name || ''}">
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <textarea id="activity-info-${activity._id}" class="form-control w-100 mb-n2" rows="4" placeholder="Description">${activity.desc || ''}</textarea>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col-12 col-md-6 mb-2">
        <label for="activity-date-${activity._id}" class="ml-2">Event Date:</label>
        <input id="activity-date-${activity._id}" type="date" class="form-control" value="${activity.event_date || ''}">
      </div>
      <div class="col-12 col-md-6 mb-2">
        <label for="activity-time-${activity._id}" class="ml-2">Event Time:</label>
        <input id="activity-time-${activity._id}" type="time" class="form-control" value="${activity.event_time || ''}">
      </div>
      <div class="col-12">
        <label for="activity-venue-${activity._id}" class="ml-2">Venue:</label>
        <input id="activity-venue-${activity._id}" type="text" class="form-control" placeholder="Venue" value="${activity.venue || ''}">
      </div>
    </div>
    
    <div class="d-flex justify-content-end">
      <button class="btn btn-outline-info me-2 mr-1" onclick="UpdateActivity('${activity._id}')">Save</button>
      <button class="btn btn-outline-danger" onclick="DeleteActivity('${activity._id}')">Delete</button>
    </div>
  </div>
</div>
    `
    $('#activity-edit-container').append(element)
}

function GetActivityData() {
    const url = "http://127.0.0.1:5879/activity";  // API endpoint

    $.get(url, function (data) {
        container = $('#activity-edit-container');
        container.empty()
        data.forEach(activity => {
            console.log("update",activity)
            AddActivityBlock(activity)
        });
            
    });
}

function GetSingleActivity(activity_id){
    const url = `http://127.0.0.1:5879/activity/${activity_id}`

    $.get(url, function (data) {
        console.log(data);
    });
}

function CreateActivity(){
    // Prepare the data to send
    const data = {
        name: "",
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/activity", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(data), // Convert JS object to JSON string
        success: function(response) {
            console.log("Update created successfully:", response);
            AddActivityBlock(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to create update:", error);
        }
    });

}

function DeleteActivity(activity_id) {
    // Confirm if the user really wants to delete the team
    const confirmation = confirm("Are you sure you want to delete this team member?");

    if (confirmation) {
        console.log(`Requesting deletion for: http://127.0.0.1:5879/activity/${activity_id}`);
        // Find the team element on the screen
        const element = $('#activity-block-'+activity_id)

        if (element) {
            // Make an AJAX DELETE request to delete the team from the database
            $.ajax({
                url: `http://127.0.0.1:5879/activity/${activity_id}`,  // API URL with the teamID
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("activity deleted successfully:", response);
                    
                    // Remove the team element from the DOM after successful deletion
                    element.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete update:", error);
                }
            });
        } else {
            console.error("update element not found for ID:", activity_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function UpdateActivity(activity_id) {
    const element = $('#activity-block-' + activity_id);

    if (element) {
        const data = {
            name: $('#activity-name-' + activity_id).val(),
            desc: $('#activity-info-' + activity_id).val(),
            venue: $('#activity-venue-' + activity_id).val(),
            event_date: $('#activity-date-' + activity_id).val(),
            event_time:  $('#activity-time-' + activity_id).val()  // Use the time string directly
        };

        console.log("Data to be updated:", data);

        $.ajax({
            url: `http://127.0.0.1:5879/activity/${activity_id}`,
            type: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(response) {
                console.log("Event updated successfully:", response);
            },
            error: function(xhr, status, error) {
                console.error("Failed to update event:", error);
            }
        });
    } else {
        console.error("Event element not found for ID:", activity_id);
    }
}

////////////////////// research ////////////////////

function AddResearchBlock(research) {
    console.log(research);

    // Set default values if properties are missing or undefined
    let title = research.title || '';
    let author = research.author || '';
    let pubDate = research.meta && research.meta.pub_date ? research.meta.pub_date.split('T')[0] : ''; // Formatting date
    let category = research.meta && research.meta.category ? research.meta.category : '';
    let department = research.meta && research.meta.department ? research.meta.department : '';
    let abstract = research.content && research.content.abstract ? research.content.abstract : '';
    // let doc = research.content.doc;
    let doc = undefined;
    if (research.content && research.content.doc ? research.content.doc : ''){
        doc = research.content.doc
    }
    let link = research.content && research.content.link ? research.content.link : '';
    let keywords = research.add && research.add.keywords ? research.add.keywords : '';
    let contributors = research.add && research.add.contributors ? research.add.contributors : '';

    let element = `
    <div id="research-block-${research._id}" class="container mb-2 mt-2">
        <div class="row border rounded p-3 shadow-sm mb-2">
        
            <!-- Research Title -->
            <div class="col-12 mb-3">
                <input id="research-title-${research._id}" type="text" class="form-control" placeholder="Research Title" value="${title}">
            </div>
            
            <!-- Research Author -->
            <div class="col-12 mb-3">
                <input id="research-author-${research._id}" type="text" class="form-control" placeholder="Author" value="${author}">
            </div>
    
            <!-- Research Abstract -->
            <div class="row mb-auto w-100 ml-1">
                <div class="col-md-4 col-12 mb-3">
                    <input id="research-pub-date-${research._id}" type="date" class="form-control ml-auto" value="${pubDate}">
                </div>
                <div class="col-md-4 col-12 mb-3">
                    <input id="research-category-${research._id}" type="text" class="form-control ml-auto" placeholder="Category" value="${category}">
                </div>
                <div class="col-md-4 col-12 mb-3">
                    <input id="research-department-${research._id}" type="text" class="form-control ml-auto" placeholder="Department" value="${department}">
                </div>
            </div>
            
            <div class="col-12 mb-3">
                <textarea id="research-abstract-${research._id}" class="form-control" rows="3" placeholder="Abstract">${abstract}</textarea>
            </div>
    
            <!-- Document Upload and External Link -->
            <div class="row mb-auto w-100 ml-1">
                <div class="col-12 mb-3 col-md-5">
                    <div style="overflow: hidden;" class="file-preview-container break-at-slash border rounded" onclick="document.getElementById('fileInput-${research._id}').click()">
                        <h5 id="filePreview-${research._id}" class="mb-auto w-100 pt-1 d-flex justify-content-center pb-2">${doc ? 'File Selected ✅' : 'Click to select file 👆'}</h5>
                        <input type="file" id="fileInput-${research._id}" accept= application/pdf" onchange="UploadFile2Drive(event, '${research._id}', 'research')" style="display:none;">
                    </div>
                </div>
                
                <div class="col-12 mb-3 col-md-7">
                    <input id="research-link-${research._id}" type="text" class="form-control ml-auto" placeholder="External Link (URL)" value="${link}">
                </div>
            </div>
    
            <!-- Keywords (String Input) -->
            <div class="col-12 mb-3">
                <input id="research-keywords-${research._id}" type="text" class="form-control" placeholder="Keywords" value="${keywords}">
            </div>
    
            <!-- Contributors -->
            <div class="col-12 mb-3">
                <input id="research-contributors-${research._id}" type="text" class="form-control" placeholder="Contributors" value="${contributors}">
            </div>
    
            <!-- Save/Update Buttons -->
            <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-outline-info me-2 mr-2" onclick="SaveResearch('${research._id}')">Save</button>
                <button class="btn btn-outline-danger" onclick="DeleteResearch('${research._id}')">Delete</button>
            </div>
        </div>
    </div>
    `;

    $('#research-edit-container').append(element);
}


function GetResearchData() {
    const url = "http://127.0.0.1:5879/research";  // API endpoint

    $.get(url, function (data) {
        container = $('#research-edit-container');
        container.empty()
        data.forEach(research => {
            console.log("research",research)
            AddResearchBlock(research)
        });
            
    });
}

function CreateResearch(){
    // Prepare the data to send
    const data = {
        title: "",
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/research", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(data), // Convert JS object to JSON string
        success: function(response) {
            console.log("Update created successfully:", response);
            AddResearchBlock(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to create update:", error);
        }
    });

}

function DeleteResearch(research_id) {
    // Confirm if the user really wants to delete the team
    const confirmation = confirm("Are you sure you want to delete this research detailes?");

    if (confirmation) {
        console.log(`Requesting deletion for: http://127.0.0.1:5879/research/${research_id}`);
        // Find the team element on the screen
        const element = $('#research-block-'+research_id)

        if (element) {
            // Make an AJAX DELETE request to delete the team from the database
            $.ajax({
                url: `http://127.0.0.1:5879/research/${research_id}`,  // API URL with the teamID
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("activity deleted successfully:", response);
                    
                    // Remove the team element from the DOM after successful deletion
                    element.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete Research:", error);
                }
            });
        } else {
            console.error("update element not found for ID:", research_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function SaveResearch(research_id) {
    const element = $('#research-block-' + research_id);

    if (element) {
        const pubDateString = $(`#research-pub-date-${research_id}`).val();
        const pubDate = pubDateString ? new Date(pubDateString) : null; // Convert to Date object

        const data = {
            title: $(`#research-title-${research_id}`).val(),
            author: $(`#research-author-${research_id}`).val(),
            content: {
                abstract: $(`#research-abstract-${research_id}`).val(),
                link: $(`#research-link-${research_id}`).val(),
            },
            meta: {
                pub_date: pubDate, // Pass the Date object here
                category: $(`#research-category-${research_id}`).val(),
                department: $(`#research-department-${research_id}`).val(),
            },
            add: {
                keywords: $(`#research-keywords-${research_id}`).val(),
                contributors: $(`#research-contributors-${research_id}`).val(),
            }
        };

        console.log("Data to be updated:", data);

        $.ajax({
            url: `http://127.0.0.1:5879/research/${research_id}`,  // API endpoint for update
            type: "PUT",
            data: JSON.stringify(data),                           // Send JSON data
            contentType: "application/json",                      // Ensure the data is sent as JSON
            success: function(response) {
                console.log("Research updated successfully:", response);
            },
            error: function(xhr, status, error) {
                console.error("Failed to update research:", error);
            }
        });
    } else {
        console.error("Event element not found for ID:", research_id);
    }
}


//////////////////////// news letter /////////////////////////

function formatDateJS(isoString) {
    // Create a new Date object from the ISO string
    const date = new Date(isoString);
    
    // Get the year, month, and day from the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    
    // Return the formatted string in yyyy-MM-dd format
    return `${year}-${month}-${day}`;
}


function AddNewsletterBlock(newsletter){
    console.log(newsletter)
    let file_link = 'No File Selected❕'
    if (newsletter.doc){
        file_link = "File Selected ✅"
    }
    let thumb_image = "../data/img/upload.png"
    if (newsletter.thumb){
        console.log("I found it!")
        thumb_image = newsletter.thumb
    }else if (newsletter.doc){
        thumb_image = `https://lh3.googleusercontent.com/d/${newsletter.doc}`
    }
    let element = `
    <div id="newsletter-block-${newsletter._id}" class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 border-0 shadow-sm">
                <div class="card-img-top image-preview-container position-relative" onclick="document.getElementById('imageInput-${newsletter._id}').click()">
                    <img id="imagePreview-${newsletter._id}" class="img-fluid rounded-top" src="${thumb_image}" alt="Event image preview">
                    <input type="file" id="imageInput-${newsletter._id}" accept="image/*" onchange="UploadShowImage(event, '${newsletter._id}', 'newsletter-img')" style="display:none;">
                </div>
             
                <div class="card-body">
                    <div class="mb-3 file-preview-container border rounded p-2 text-center" style="cursor: pointer;" onclick="document.getElementById('fileInput-${newsletter._id}').click()">
                        <h5 id="filePreview-${newsletter._id}" class="mb-0">${file_link}</h5>
                        <input type="file" id="fileInput-${newsletter._id}" accept="application/pdf&quot;" onchange="UploadFile2Drive(event, '${newsletter._id}', 'newsletter-doc')" style="display:none;">
                    </div>
             
                    <div class="mb-3">
                        <label for="newsletter-date-${newsletter._id}" class="form-label">Published Date:</label>
                        <input id="newsletter-date-${newsletter._id}" type="date" class="form-control" value="${formatDateJS(newsletter.pub_date)}">
                    </div>
            
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-outline-info" onclick="UpdateNewsletter('${newsletter._id}')">Save</button>
                        <button class="btn btn-outline-danger" onclick="DeleteNewsletter('${newsletter._id}')">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `
    $('#newsletter-edit-container').append(element)
}

function GetNewsletterData() {
    const url = "http://127.0.0.1:5879/newsletter";  // API endpoint

    $.get(url, function (data) {
        $('#newsletter-edit-container').empty()
        data.forEach(chunk => {
            AddNewsletterBlock(chunk)
        });
            
    });
}

function CreateNewsletter(){
    // Prepare the data to send
    const data = {
        doc: "",
    };

    // Make an AJAX POST request
    $.ajax({
        url: "http://127.0.0.1:5879/newsletter", // API URL
        type: "POST",  // Request method
        contentType: "application/json", // Send as JSON
        data: JSON.stringify(data), // Convert JS object to JSON string
        success: function(response) {
            console.log("Update created successfully:", response);
            AddNewsletterBlock(response);
        },
        error: function(xhr, status, error) {
            console.error("Failed to create newsletter:", error);
        }
    });

}

function DeleteNewsletter(the_id) {
    // Confirm if the user really wants to delete the team
    const confirmation = confirm("Are you sure you want to delete this team member?");

    if (confirmation) {
        // Find the team element on the screen
        const element = $('#newsletter-block-'+the_id)

        if (element) {
            // Make an AJAX DELETE request to delete the team from the database
            $.ajax({
                url: `http://127.0.0.1:5879/newsletter/${the_id}`,  // API URL with the teamID
                type: "DELETE",  // Request method for deleting
                success: function(response) {
                    console.log("update deleted successfully:", response);
                    
                    // Remove the team element from the DOM after successful deletion
                    element.remove();
                },
                error: function(xhr, status, error) {
                    console.error("Failed to delete update:", error);
                }
            });
        } else {
            console.error("update element not found for ID:", the_id);
        }
    } else {
        console.log("Deletion cancelled by the user.");
    }
}

function UpdateNewsletter(the_id) {
    // Find the team element with the given id
    const element = $('#newsletter-block-'+the_id);

    if (element) {

        
        const data = {
            doc: $('#fileInput-'+the_id).val(),
            thumb: $('#imageInput-'+the_id).val(),
            pub_date: $('#newsletter-date-'+the_id).val()
        };

        // Log the data for checking
        console.log("Data to be updated:", data);

        // Now make an AJAX PUT request to update the team
        $.ajax({
            url: `http://127.0.0.1:5879/newsletter/${the_id}`,  // API URL with the teamID
            type: "PUT",  // Request method for updating
            data: JSON.stringify(data),  // Send the team data as JSON
            contentType: "application/json",  // Set content type as JSON
            success: function(response) {
                console.log("Team updated successfully:", response);
                // Optionally show a success message or update the UI further
            },
            error: function(xhr, status, error) {
                console.error("Failed to update team:", error);
            }
        });
    } else {
        console.error("Team element not found for ID:", the_id);
    }
}