$(document).ready(function() {

    GetPublicationData();
});

function formatMongoDate(mongoDateStr) {
    const date = new Date(mongoDateStr);
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    const month = monthNames[date.getUTCMonth()]; // Get the month name
    const year = date.getUTCFullYear(); // Get the year

    return `${month} ${year}`;
}

function AddNewsletterCard(newsletter){
    const container = $('#newsletter-card-container');
    var element = `
    <div class="col-lg-4 mb-3 mt-3">
        <a href="${newsletter.thumb}" class="text-decoration-none">
            <div class="card">
                <img src="${newsletter.thumb}" alt="Sample Image" class="card-img-top img-fluid">
                <div class="card-body">
                    <p class="card-text text-center">${formatMongoDate(newsletter.pub_date)}</p>
                </div>
            </div>
        </a>
    </div>
    `
    container.prepend(element)
}

function GetNewsletterData(){
    const url = `http://127.0.0.1:5879/newsletter`;

    $.get(url, function (data) {
        $('#newsletter-card-container').empty();
        data.forEach(chunk => {
            console.log(chunk);
            AddNewsletterCard(chunk);
        });
    });
}
