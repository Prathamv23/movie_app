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


let cast_content = [];
const limit = 6;
let current_index = 0;

console.log(movieName);

async function movie_detail(m_name){
    
    const data = await fetch_rsponse(m_name);
    console.log(data);

    m_detail.innerHTML = `
    ${data.summary}
     <div>
        <a href="${data.officialSite ?? ""}">
            <button id="m_watch">▶ Watch</button>
        </a>
     </div>
     `;
    const img = data.image?.medium ?? "images/no_image.png";
    m_img.innerHTML = `<img src="${img}">`;
    name.textContent = data.name;

    let m_genre = data.genres;
    console.log(m_genre);

    m_genre.forEach(element => {
        let link = document.createElement("li");
        link.textContent = element;
        genre.appendChild(link);        
    });

   
    general_detail.innerHTML = `
    <h3>🍿 Other Details :-</h3>
    <span>Premiered on:- ${data.premiered ?? "-"}</span>
    <span>Ended on:- ${data.ended ?? "On Going"}</span>
    <span>Type:- ${data.type ?? "-"}</span>
    <span>Language:- ${data.language ?? "-"}</span>
    <span>Country:- ${data.network?.country?.name ?? "-"}</span>
    
    `
    // let previous = data.previousepisode;
    
    //     previous_show.innerHTML=`
    //     <a href="${data.previousepisode.href}">Previous</a>
    //     <span>${data.previousepisode.name}</span>
    //     `;

    const id = data.id;
    console.log(id);
    cast_det(id);
    m_seasons(id);
    

}

async function cast_det(id){
    const response = await fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`);
    const data = await response.json();
    console.log(data._embedded.cast);
    cast_content = data._embedded.cast;
    
    new_batch();
    load_content.addEventListener("click",new_batch);

   

}

function new_batch(){

    let batch = cast_content.slice(current_index,current_index+limit)

    batch.forEach(element => {
        const div = document.createElement("div");
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

async function m_seasons(id){
    const response = await fetch(`https://api.tvmaze.com/shows/${id}/seasons`);
    const data = await response.json();

    console.log(data);

    data.forEach(element => {
        let div = document.createElement("div");

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