const btn = document.getElementById('button');

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const userName = $('#from_name').val() || 'Anonymous';
    const userEmail = $('#from_mail').val() || 'Not given';
    const userPhone = $('#from_mobile').val() || 'Not given';
    const userMessage = $('#message').val() || 'No message provided';

    $.ajax({
        url: "https://diettutapi.onrender.com/diet-admin/send-feedback",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            userName: userName,
            userEmail: userEmail,
            userPhone: userPhone,
            userMessage: userMessage
        }),
        success: function(response) {
            if (response.message === 'Success!') {
                // Disable the button after successful submission
                $('#button').prop('disabled', true);
                // $('#button').html("Reload to send again...");

                // Set a cookie to remember the state of the button
                // setCookie('messaged_r', '1', 0.5); // 30 min expiry
                DisplayAlert("Feedback sent successfully!", "success");
            } else {
                DisplayAlert("Unexpected server response", "warning");
            }
        },
        error: function(error) {
            const errorMessage = error.responseJSON && error.responseJSON.message
                ? error.responseJSON.message
                : "Unknown error";
            DisplayAlert("Error sending feedback: " + errorMessage, "danger");
        }
    });
});

// On document ready, check if the cookie exists and disable the button if necessary
$(document).ready(function() {
    // const messagedR = getCookie('messaged_r');
    // if (messagedR === '1') {
    //     $('#button').prop('disabled', true);
    // }

    // Show helper text on hover when the button is disabled

    // Show helper text on hover when the button is disabled
    $('#button').hover(function() {
        if ($(this).prop('disabled')) {
            // $(this).attr('title', 'You can send new message after some time.');
            $(this).attr('title', 'Reload to send again');
        }
    });
});