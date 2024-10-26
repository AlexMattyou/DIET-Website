$(document).ready(function() {

    GetNewsletterData();
	GetResearchData();
    P_parameter = getQueryParamValue()
    LoadResearchPage(P_parameter);

    LoadLatestNewsletter();
    LoadLatestPublication();
    LoadLatestResearch();
});


function AddNewsletterCard(chunk){
    const container = $(`#${chunk.category}-card-container`);
    var element = `
    <div class="col-lg-4 mb-3 mt-3">
        <a href="${chunk.thumb}" class="text-decoration-none">
            <div class="card">
                <img src="${chunk.thumb}" alt="Sample Image" class="card-img-top img-fluid">
                <div class="card-body">
                    <p class="card-text text-center">${formatMongoDate(chunk.pub_date)}</p>
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
        $('#publication-card-container').empty();
        data.forEach(chunk => {
            console.log(chunk);
            AddNewsletterCard(chunk);
        });
    });
}

// action researches:

function getQueryParamValue() {
    const params = new URLSearchParams(window.location.search);
    return params.get('p');
}

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

function AddResearchIndexCard(research){
    let date = formatMongoDate(research.meta.pub_date)
    const container = $('#research-index-container');
    let element = `
    <div class="w-100">
        <a href="p.html?p=${research._id}" class="text-decoration-none">
            <div class="p-3 border-bottom">
                <h4 class="mb-1">${research.title}</h4>
                <p class="text-muted mb-0">By ${research.author}</p>
                <p class="text-muted">Published: ${date}</p>
            </div>
        </a>
    </div>
    `;
    container.append(element);
}

function GetResearchData(){
    const url = `http://127.0.0.1:5879/research`;

    $.get(url, function (data) {
        $('#research-index-container').empty();
        data.forEach(chunk => {
            console.log(chunk);
            AddResearchIndexCard(chunk);
        });
    });
}

function LoadResearchPage(research_id) {
    const url = `http://127.0.0.1:5879/research/${research_id}`;
    
    $.get(url, function (data) {
        console.log("Data fetched:", data);
        $('#show-research-title').html(data.title);
        $('#show-research-author').html(data.author);
        $('#show-research-abstract').html(data.content.abstract);
        $('#show-research-doc').attr('src', data.content.doc); // Fix for src
        $('#show-research-link').html(data.content.link);
        $('#show-research-pub-date').html(formatMongoDate(data.meta.pub_date));
        $('#show-research-category').html(data.meta.category);
        $('#show-research-department').html(data.meta.department);
        $('#show-research-keywords').html(alignKeywords(data.add.keywords)); // Proper field name
        $('#show-research-contributors').html(data.add.contributors); // Corrected typo
    }).fail(function() {
        console.log("Error fetching data");
    });
}


function alignKeywords(inputStr) {
    let keywords = inputStr.split(',').map(kw => kw.trim());
    let result = '';
    
    keywords.forEach((keyword, index) => {
            result += `<span class="badge text-dark p-2 mt-1 mb-1 alert-secondary">#${keyword}</span>\n`;
    });
    
    return result;
}
