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

// new team button:
const clickableContainers = document.querySelectorAll('.clickable-container');

clickableContainers.forEach(container => {
  container.addEventListener('click', () => {
    // Your JavaScript function to handle the click here
    console.log('Button clicked!');

    // Replace with your actual function logic (e.g., call another function, show a message)
    alert('Button clicked!');
  });
});

/////////////////////// -> Get data opperation

const url = "http://127.0.0.1:5879/team";  // API endpoint

    // Fetch and display data using jQuery
    $.get(url, function(data) {
        let teamHtml = '';

        // Loop through the team data
        data.forEach(team => {
            const teamId = `team-${team._id}`;  // Create a unique id using team id

            teamHtml += `
                <div id="${teamId}" class="col-md-6">
                    <div class="border p-3 color-container">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <!-- Modern Image Upload -->
                                <div class="image-upload-wrapper">
                                    <div class="image-upload">
                                        <input type="file" class="file-input d-none" accept="image/*">
                                        <img class="image-preview img-fluid" src="${team.image || ''}" alt="Team member image preview">
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
                            <button type="button" class="btn btn-outline-info mark-button team-update">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    fill="currentColor" class="bi bi-arrow-up-square-fill" viewbox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M3.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1 0-1h2A1.5 1.5 0 0 1 14 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-8A1.5 1.5 0 0 1 3.5 5h2a.5.5 0 0 1 0 1z" />
                                    <path fill-rule="evenodd"
                                        d="M7.646.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 1.707V10.5a.5.5 0 0 1-1 0V1.707L5.354 3.854a.5.5 0 1 1-.708-.708z" />
                                </svg>
                                Update
                            </button>
                            <button type="button" class="btn btn-outline-danger mark-button team-delete">
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

        // Append the team HTML into the all-team-container
        $('#all-team-container').html(teamHtml);
    });

