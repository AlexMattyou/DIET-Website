$(document).ready(function () {

    // Select all image upload boxes
    const imageUploadBoxes = document.querySelectorAll('.image-upload');

    imageUploadBoxes.forEach(box => {
        // Open file manager when clicking the upload box
        box.addEventListener('click', () => {
            const fileInput = box.querySelector('.file-input');
            fileInput.click();
        });

        // Handle file input change (when selecting a file)
        const fileInput = box.querySelector('.file-input');
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            handleFile(file, box);
        });

        // Handle file drop
        box.addEventListener('dragover', (e) => {
            e.preventDefault();
            box.classList.add('border-primary');
        });

        box.addEventListener('dragleave', () => {
            box.classList.remove('border-primary');
        });

        box.addEventListener('drop', (e) => {
            e.preventDefault();
            box.classList.remove('border-primary');
            const file = e.dataTransfer.files[0];
            handleFile(file, box);
        });

        // Handle pasted URLs for image
        box.addEventListener('paste', (e) => {
            const pastedData = e.clipboardData.getData('text');
            if (pastedData && (pastedData.startsWith('http://') || pastedData.startsWith('https://'))) {
                const imagePreview = box.querySelector('.image-preview');
                const uploadPrompt = box.querySelector('.image-upload-prompt');
                imagePreview.src = pastedData;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            }
        });
    });

    // Handle image files
    function handleFile(file, box) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = box.querySelector('.image-preview');
                const uploadPrompt = box.querySelector('.image-upload-prompt');
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                uploadPrompt.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }


    /////////////////////// -> Get data opperation
    GetTeamData()
});


// Fetch and display data using jQuery
function GetTeamData() {
    const url = "https://diet-api-dm7h.onrender.com/team";  // API endpoint

    $.get(url, function (data) {
        let teamHtml = '';

        // Loop through the team data
        data.forEach(team => {

            let imageSrc = '';
            if (team.image) {
                imageSrc = `data:image/jpeg;base64,${team.image}`;
            }

            teamHtml += `
                <div id="${team._id}" class="col-md-6 p-2">
                    <div class="border p-3 color-container">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <!-- Modern Image Upload -->
                                <div class="image-upload-wrapper">
                                    <div class="image-upload">
                                        <input type="file" class="file-input d-none" accept="image/*">
                                        <img class="image-preview img-fluid" src="${imageSrc  || "https://diettuty.onrender.com/data/img/no-profile.jpg"}" alt="Team member image preview">
                                        <div class="image-upload-prompt">
                                            <b>Drag & Drop or Click to Upload Image</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-8">
                                <input type="text" class="form-control mb-3 team-name" value="${team.name || ''}" placeholder="Name">
                                <input type="text" class="form-control mb-3 team-occupation" value="${team.occulation || ''}" placeholder="Occupation">
                                <textarea class="form-control mb-3 team-address" placeholder="Address">${team.address || ''}</textarea>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end gap-3">
                            <button type="button" class="btn btn-outline-info mark-button team-update" onClick="UpdateTeam('${team._id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    fill="currentColor" class="bi bi-arrow-up-square-fill" viewbox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z" />
                                    <path fill-rule="evenodd"
                                        d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z" />
                                </svg>
                                Update
                            </button>
                            <button type="button" class="btn btn-outline-danger mark-button team-delete" onClick="DeleteTeam('${team._id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    fill="currentColor" class="bi bi-trash-fill" viewbox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        let addNewTeamHtml = `
        
        <div class="col-md-6 p-2">
  <button class="d-flex justify-content-center align-items-center border p-3 h-100 w-100 alert-success" onClick="CreateTeam()">
    <svg xmlns="http://www.w3.org/2000/svg" width="40%" height="40%" fill="var(--success)" class="bi bi-plus-square" viewBox="0 0 16 16">
      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
    </svg>
  </button>
</div>
        
        `

        // Append the team HTML into the all-team-container
        $('#all-team-container').html(teamHtml);
        $('#all-team-container').append(addNewTeamHtml);
    });
}

function CreateTeam(){
    // Prepare the data to send
    const teamData = {
        name: "New Name"
    };

    // Make an AJAX POST request
    $.ajax({
        url: "https://diet-api-dm7h.onrender.com/team", // API URL
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

function DeleteTeam(teamID){
    // Find the team element on the screen
    const teamElement = document.getElementById(teamID);

    if (teamElement) {
        // Make an AJAX DELETE request to delete the team from the database
        $.ajax({
            url: `https://diet-api-dm7h.onrender.com/team/${teamID}`,  // API URL with the teamID
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
}

function UpdateTeam(teamID){
    // Find the team element with the given id
    const teamElement = document.getElementById(teamID);
    
    if (teamElement) {
        // Find the input elements inside this specific team box
        const name = teamElement.querySelector('.team-name').value;
        const occupation = teamElement.querySelector('.team-occupation').value;
        const address = teamElement.querySelector('.team-address').value;

        // Prepare the data in the required format
        const teamData = {
            name: name,
            occupation: occupation,
            address: address
        };

        // Log the data for checking
        console.log("Data to be updated:", teamData);

        // Now make an AJAX PUT request to update the team
        $.ajax({
            url: `https://diet-api-dm7h.onrender.com/team/${teamID}`,  // API URL with the teamID
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