


function loadTeamMembers() {
    
    const teamContainer = document.getElementById("team-container");

    $.get("https://diet-api-dm7h.onrender.com/team", function (teams) {
        // Clear existing content
        teamContainer.innerHTML = '';

        // Loop through the team members
        teams.forEach((team) => {
            const teamBox = document.createElement("div");
            teamBox.className = "col-lg-4 col-md-6 col-6 py-3";

            teamBox.innerHTML = `
                <div>
                    <div class="image-container mx-auto">
                        <img src="${team.image || 'default_image_url'}" alt="..." class="img-fluid rounded-circle">
                    </div>
                    <div>
                        <h3 class="fw-bold h4 mb-1 text-uppercase">${team.name || 'Name'}</h3><br>
                        <h4 class="fw-light h6 mb-3">${team.occupation || 'Occupation'}</h4><br>
                        <p class="fw-light mb-4">${team.address || 'Address'}</p>
                    </div>
                </div>
            `;

            // Append the team box to the container
            teamContainer.appendChild(teamBox);
        });
    }).fail(function (error) {
        console.error("Error fetching team data:", error);
    });
}

// Call the function to load team members


$(document).ready(function() {
    loadTeamMembers();
  });