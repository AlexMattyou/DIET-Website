const btn = document.getElementById('button');

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userName = $('#from_name').val() || 'Anonymous';
    const userEmail = $('#from_mail').val() || 'Not given';
    const userPhone = $('#from_mobile').val() || 'Not given';
    const userMessage = $('#message').val() || 'No message provided';

    $.ajax({
        url: "https://diet-api-dm7h.onrender.com/diet-admin/send-feedback",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            userName: userName,
            userEmail: userEmail,
            userPhone: userPhone,
            userMessage: userMessage
        }),
        success: function(response) {
            // Check if response message is "Success!" to confirm email was sent
            if (response.message === 'Success!') {
                DisplayAlert("Feedback sent successfully!", "success");
            } else {
                DisplayAlert("Unexpected server response", "warning");
            }
        },
        error: function(error) {
            // Show detailed error message from the backend response if available
            const errorMessage = error.responseJSON && error.responseJSON.message 
                ? error.responseJSON.message 
                : "Unknown error";
                DisplayAlert("Error sending feedback: " + errorMessage, "danger");
        }
    });
});

