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