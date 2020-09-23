const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_URL = 'http://localhost:5000/mews';

// loading data gif to indicate fetching data
loadingElement.style.display = '';

listAllMews();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');
    
    const mew = {
        name,
        content,
    };
    
    form.style.display = 'none';
    loadingElement.style.display = '';
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
        .then(createdMew => {
            form.reset();
            form.style.display = '';
            listAllMews();
        });
});

function listAllMews() {
    // clear mews if anything there to not see the copy of old messages
    mewsElement.innerHTML = '';
    // etch the data
    fetch(API_URL)
        .then( response => response.json())
        .then( mews => {
            // put the newest mews on top
            mews.reverse();
            // loop through all mews and build html part
            mews.forEach( mew => {
                const div = document.createElement('div');
                div.className = 'mew';

                const header = document.createElement('span');
                header.textContent = mew.name;

                const contents = document.createElement('p');
                contents.textContent = mew.content;

                const date = document.createElement('small');
                date.textContent = new Date(mew.created);

                // finalize div container
                div.appendChild(header);
                div.appendChild(contents);
                div.appendChild(date);
                // instantiate to html code
                mewsElement.appendChild(div);
            });
            loadingElement.style.display = 'none';
        });
}