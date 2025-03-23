// Fetch and display data using jQuery
$(document).ready(function () {

    GetTeamData()
});
console.log("allson")

function GetTeamData() {
    const url = "https://diettutapi.onrender.com/team";  // API endpoint

    $.get(url, function (data) {
        let teachTeamHtml = '';
        let nonTeachTeamHtml = '';

        // const imageURL = team.image
        // const image = imageElement ? imageElement.value : "https://diettut.org/data/img/no-profile.jpg";

        // Loop through the team data
        data.forEach(team => {
            let teamHtml = `
            
<div id="${team._id}" class="col-lg-3 col-md-4 col-6 py-3 flip-container "> <!-- Column class for Bootstrap -->
<div class="card-flip"> <!-- Card flip container -->
<div class="card front shadow bg-transparent"> <!-- Front side of the card -->
<div> 
<br>				<div class="image-container mx-auto"> 
<img src="${team.image || 'https://diettut.org/data/img/no-profile.jpg'}" alt="...">
</div><br class="no-desktop">
<div>
<h4 class="fw-bold mb-1 text-uppercase h5">${team.name || ''}</h4><br><h5 class="fw-light h6 mb-3">${team.designation || '-'}</h5>
</div>									 
</div>
</div>
<div class="card back shadow bg-transparent"> <!-- Back side of the card -->
<div class="card-body text-center alert-primary">
<h5 class="card-title">Contact Info</h5>
<div class="contact-info text-start">
<p class="card-text">Address: <br><span>${team.address || '-'}</span></p    >
<p class="card-text">Mobile no: <br><span>${team.phone1 || ''}</span><br><span>${team.phone2 || ''}</span></p>
</div>
</div>
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

        // Append to the HTML elements
        document.getElementById('teach-container').innerHTML = teachTeamHtml || '';
        document.getElementById('non-teach-container').innerHTML = nonTeachTeamHtml || '';
    });
}