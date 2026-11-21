import { fetch_rsponse } from "./api/api_fetch.js";


const urlParams = new URLSearchParams(window.location.search);
const movieName = urlParams.get('q');
console.log(window);

const m_detail = document.querySelector("#detail");
const m_img = document.querySelector("#m_img");
const name = document.querySelector("#name");
const genre = document.querySelector("#genre");
const general_detail = document.querySelector("#general_d");
const cast = document.querySelector("#cast");
const load_content = document.querySelector("#load-more");
const seasons = document.querySelector("#seasons");
const cards = document.getElementsByClassName("name-detail");
const cast_li = document.querySelector("#cast-li");
const crew_li = document.querySelector("#crew-li");
const img_li = document.querySelector("#img-li");


let cast_content = [];
let crew_content = [];
let image_content = [];
let id;
let current_section = "cast";

const limit = 6;
let current_index = 0;

console.log(movieName);


function skeleton_loader(){

    m_detail.innerHTML = `
    <div class="skeleton sk-text"></div>
    <div class = "skeleton sk-title">
        
     </div>
    `;

    m_img.innerHTML = `<div class = "skeleton sk-card-img"></div>`;

    genre.innerHTML = `
    <div class="skeleton sk-pill></div>
    <div class="skeleton sk-pill></div>
    <div class="skeleton sk-pill></div>
    `;

    cards.innerHTML = `
    <div class="skeleton sk-poster"></div>
    `
    
    general_detail.innerHTML = `
    <div class="skeleton sk-title"></div>
    <div class="skeleton sk-text.short"></div>
    <div class="skeleton sk-text.short"></div>
    <div class="skeleton sk-text.short"></div>
    <div class="skeleton sk-text.short"></div>
    `;

    seasons.innerHTML = `
    <div class="skeleton sk-card-img"></div>
    <div class="skeleton sk-text"></div>
    <div class="skeleton sk-text.short"></div>
    `;

    cast.innerHTML = Array(3).fill`
    <div class="skeleton sk-card-img"></div>
    <div class="skeleton sk-text.short"></div>
    `.join("");

    //load_content.style.display = "none";
}

async function movie_detail(m_name){
    
    skeleton_loader();
    const m_response = await fetch(`https://api.tvmaze.com/singlesearch/shows?q=${m_name}`);
    const data = await m_response.json();
    console.log(data);
    setTimeout(() => {
        m_detail.innerHTML = `
        ${data.summary}
        <div>
            <a href="${data.officialSite ?? ""}">
                <button id="m_watch">▶ Watch</button>
            </a>
        </div>
        `;
        m_img.innerHTML = "";
        const img = data.image?.medium ?? "images/no_image.png";
        m_img.innerHTML = `<img src="${img}">`;
        name.textContent = data.name;

        
        let m_genre = data.genres;
        console.log(m_genre);

        genre.innerHTML = "";

        m_genre.forEach(element => {
            let link = document.createElement("li");
            link.textContent = element;
            genre.appendChild(link);        
        }); 

        general_detail.innerHTML="";
        general_detail.innerHTML = `
        <h3>🍿 Other Details :-</h3>
        <span>Premiered on:- ${data.premiered ?? "-"}</span>
        <span>Ended on:- ${data.ended ?? "On Going"}</span>
        <span>Type:- ${data.type ?? "-"}</span>
        <span>Language:- ${data.language ?? "-"}</span>
        <span>Country:- ${data.network?.country?.name ?? "-"}</span>
        
        `;

        id = data.id;

        console.log(id);

        cast_det(id);

    

        m_seasons(id);
    },3000);
    
}

cast_li.addEventListener("click",(e) => {
        e.preventDefault();
        current_section = "cast";
        cast_det();
    }
);

crew_li.addEventListener("click",(e) => {
        e.preventDefault();
        current_section = "crew";
        crew_det();
    }
);

img_li.addEventListener("click",(e) => {
        e.preventDefault();
        current_section = "images";
        image_det();
    }
);

async function cast_det(){
    
    cast.innerHTML = "";
    current_index = 0;
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`);
    const data = await response.json();
    console.log(data._embedded.cast);
    cast_content = data._embedded.cast;
    
    new_batch();
    load_content.style.display = "block";
    //load_content.addEventListener("click",new_batch);


}

function new_batch(){

    let batch = cast_content.slice(current_index,current_index+limit);
    
    batch.forEach(element => {
        const div = document.createElement("div");
        div.innerHTML = "";
        div.className = "casts-det";
        div.innerHTML = `
        <img src="${element.character.image?.medium ?? 'images/no_image.png'}">
        <h4><span>Character Name:-</span>${element.character.name}</h4>
        <h4><span>Real Name:-</span> ${element.person.name}</h4>
        `
        cast.appendChild(div);
    });
    current_index+=limit;

     if(current_index>= cast_content.length){
        load_content.style.display = "none";
    }
    
}

async function crew_det() {

    cast.innerHTML = "";

    current_index = 0;

    const response = await fetch(`https://api.tvmaze.com/shows/${id}/crew`);
    const data = await response.json();

    crew_content = data;

    load_content.style.display = "block";

    crew_batch();

}

function crew_batch() {

    let batch = crew_content.slice(current_index, current_index + limit);

    batch.forEach(element => {

        const div = document.createElement("div");

        div.className = "casts-det";

        div.innerHTML = `
            <img src="${element.person.image?.medium ?? 'images/no_image.png'}">
            <h3>${element.person.name}</h3>
            <h4>${element.type}</h4>
        `;

        cast.appendChild(div);

    });

    current_index += limit;

    if (current_index >= crew_content.length) {
        load_content.style.display = "none";
    }

}

async function image_det(){
    cast.innerHTML = "";
    const response = await fetch(`https://api.tvmaze.com/shows/${id}/images`)
    const data = await response.json();

    console.log(data);

    //current_index=0;

    image_content = data;

    image_content.forEach(element => {

        const div = document.createElement("div");

        div.className = "casts-det";
        let images = element.resolutions.medium?.url ?? 'images/no_image.png';
        div.innerHTML = `
            <img src="${images}">
            
        `;

        cast.appendChild(div);

    });
     
    load_content.style.display = "none";

    //img_batch();

}

// function img_batch(){
//     let batch = image_content.slice(current_index, current_index + limit);

//     batch.forEach(element => {

//         const div = document.createElement("div");

//         div.className = "casts-det";
//         let images = element.resolutions.medium.url || element.resolutions.original.url || 'images/no_image.png';
//         div.innerHTML = `
//             <img src="${images}">
            
//         `;

//         cast.appendChild(div);

//     });

//     current_index += limit;

//     if (current_index >= image_content.length) {
//         load_content.style.display = "none";
//     }
// }

load_content.addEventListener("click", () => {

    if (current_section === "cast") {
        new_batch();
    }
    else if (current_section === "crew") {
        crew_batch();
    }
    else if (current_section === "images"){
        
        image_det();
    }

});


async function m_seasons(id){
    seasons.innerHTML = "";
    
    const response = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`);
    const data = await response.json();

    console.log(data);

    data.forEach(element => {
        let div = document.createElement("div");
        div.innerHTML = "";
        div.innerHTML = `
        
        <img src="${element.image?.medium ?? 'images/no_image.png'}" class="season-img">
        <h3 class="season-index">season-${element.number ?? "-"}</h3>
        <div>${element.summary ?? ""}</div>
        <span>Episodes:- ${element.episodeOrder ?? "-"}</span>
        <span>Premiered on:- ${element.premiereDate ?? "To be soon"}</span>
        `;

        seasons.appendChild(div);
        
    });

}



movie_detail(movieName);

