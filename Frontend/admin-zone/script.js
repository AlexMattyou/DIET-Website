$(document).ready(function () {

    GetTeamData()
});

function updateImagePreview(teamID) {

    const teamElement = document.getElementById(teamID);

    // Get the value of the input element (image URL)
    const imageElement = teamElement.querySelector('.image-url-input');
    const imageUrl = imageElement ? imageElement.value : "https://diettuty.onrender.com/data/img/no-profile.jpg";

    // Find the closest image element in the DOM to update the src attribute
    const previewImage = teamElement.querySelector('.image-preview'); // Assuming the image is right below the input

    // Update the image src attribute if the URL is valid
    if (previewImage) {
        previewImage.src = imageUrl || 'https://diettuty.onrender.com/data/img/no-profile.jpg';
    }
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
                                    <img class="image-preview img-fluid mt-3" 
                                        src="${team.image || 'https://diettuty.onrender.com/data/img/about-us/district.png'}" 
                                        alt="Team member image preview">
                                    <input type="file" id="imageInput-${team._id}" accept="image/*" 
                                        onchange="previewImage(event, '${team._id}')" style="display:none;">
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
                            <button type="button" class="btn btn-outline-info mark-button team-update" onClick="UpdateTeam('${team._id}')">
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
    const confirmation = confirm("Are you sure you want to delete this team?");

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

        const imageElement = teamElement.querySelector('.image-url-input');
        const image = imageElement ? imageElement.value : "https://diettuty.onrender.com/data/img/no-profile.jpg"; // Image URL input
        const imagePreview = teamElement.querySelector('.image-preview');
        imageElement.src = image;


        // Prepare the data in the required format
        const teamData = {
            name: name,
            designation: designation,
            address: address,
            phone1: phone1,
            phone2: phone2,
            image: image
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
