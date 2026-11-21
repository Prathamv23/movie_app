import { doc_elements } from "./functions/elements.js";
import { fetch_rsponse } from "./api/api_fetch.js";
import { save_favorites, favorites,add_favorite, remove_favorite } from "./storage/local_storage.js";



const {input,submit,form,movie_card,status,err} = doc_elements();
let h_movie = [];
let current_index = 0;
const load_content = document.querySelector("#load-more");
const favor = document.querySelector("#favor");
let page_in = "home";

// let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// export function save_favorites(){
//     localStorage.setItem("favorites",JSON.stringify(favorites));
//     console.log(favorites);
// }


// async function all_movies(){
//     const response = await fetch("");

// }

favor.addEventListener("click", (e) => {
    e.preventDefault();

    if (page_in === "home") {
        favor.textContent = "< Back";
        favor.style.backgroundColor = "red";
        favor.style.marginRight ="65%";
        display_fav();

    } else if (page_in === "favorites") {
        favor.textContent = "Favorites";
        favor.style.backgroundColor = " rgb(232, 42, 105)";
        favor.style.marginRight ="0px";
        homePage_movie();
    }
});

async function get_movie(m_name){
    try{
        movie_card.innerHTML = "";
        
        const data = await fetch_rsponse(m_name);

        if(data.length !== 0){
            status.textContent = "Best Results";
            err.textContent = "";
            data.forEach(element => {
                const name = element.show.name;

                const image = element.show.image?.medium ?? "images/no_image.png";
                
                const rating = element.show.rating?.average ?? "No Rating";
                
                card_layout(name,image,rating);
                console.log(element)
            });
            
            console.log(data);
            
            return data;
        }
        else{
            status.textContent = "";
            err.textContent = "404 movie not available";
            err.style.color = "red";
            err.style.fontSize = "34px";
        }
    }
    catch(e){
        console.log(e);
    }

}

function card_layout(name, image, rating) {

    let isLiked = favorites.some(item => item.name === name);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    
        <a href="movie_detail.html?q=${name}"style="cursor: pointer" ><img src="${image}" alt="${name}"></a>
        <div class="m-detail">
            <h2>${name}</h2>
            <div class="r-b">
            <span>${rating}</span>
            <button class="heart-btn" style="font-size: 28px; background: none; border: none; cursor: pointer; color: ${isLiked ? '#e0245e' : '#555'};">
                ${isLiked ? '♥' : '♡'}
            </button>
            </div>
        </div>
    `;

    const btn = card.querySelector('.heart-btn');

    btn.addEventListener('click', () => {
        isLiked = !isLiked;
        btn.innerHTML = isLiked ? '♥' : '♡';
        btn.style.color = isLiked ? '#e0245e' : '#555';
        
        

        if (isLiked) {
            add_favorite({
                "name": name,
                "image": image,
                "rating": rating,
                "isLiked": true
            });
        } else {
            remove_favorite(name);
            
        }
        save_favorites();
    });

    movie_card.appendChild(card);
}


function display_fav(){
    movie_card.innerHTML = "";
    load_content.style.display = "none";
    page_in = "favorites";
    
    // const back = document.createElement("a");
    // back.className = "back-btn";
    // back.href = "index.html";
    // back.textContent = "Back";

    // form.appendChild(back);

    status.textContent = "Favorites";
    err.textContent = "";
    favorites.forEach(fav => card_layout(fav.name, fav.image, fav.rating));
  
}

// function display(name,image,rating){
//     movie_card.innerHTML = "";
//     card_layout(name, image, rating);

// }

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const movie_name = input.value.replace(" ","%20");
    console.log(movie_name);

    get_movie(movie_name);
    
});

input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        status.textContent="";
        homePage_movie();
        page_in = "home";
    }
});

async function homePage_movie(){
    movie_card.innerHTML = "";
    status.textContent = "";
    err.textContent = "";
    page_in = "home";

    current_index = 0;

    const response = await fetch("https://api.tvmaze.com/shows");
    let data = await response.json();

    console.log(data);
    h_movie = data;

    homepage_batch();
    load_content.addEventListener("click",homepage_batch);
    load_content.style.display = "block";

}

function homepage_batch(){
    
    const limit = 12;

    let batch = h_movie.slice(current_index,current_index+limit);

    batch.forEach(element => {
         const name = element.name;

         const image = element.image?.medium ?? "images/no_image.png";
                
         const rating = element.rating?.average ?? "No Rating";
                
         card_layout(name,image,rating);
         console.log(element);
    });

    current_index+=limit;

     if(current_index>= h_movie.length){
        load_content.style.display = "none";
    }

}




// let currentPage = 0;
// let pagination;

// Create pagination buttons
// function create_pagination() {
//     pagination = document.createElement("div");
//     pagination.className = "pagination";

//     const previousBtn = document.createElement("button");
//     previousBtn.textContent = "Previous";

//     const pageNumber = document.createElement("span");

//     const nextBtn = document.createElement("button");
//     nextBtn.textContent = "Next";

//     previousBtn.addEventListener("click", () => {
//         if (currentPage > 0) {
//             currentPage--;
//             load_all_shows();
//         }
//     });

//     nextBtn.addEventListener("click", () => {
//         currentPage++;
//         load_all_shows();
//     });

//     pagination.append(previousBtn, pageNumber, nextBtn);

//     movie_card.after(pagination);

//     return { previousBtn, nextBtn, pageNumber };
// }

// // Load all shows from TVmaze
// async function load_all_shows() {
//     try {
//         movie_card.innerHTML = "";
//         status.textContent = "Loading shows...";
//         err.textContent = "";

//         const response = await fetch(
//             `https://api.tvmaze.com/shows`
//         );

//         if (!response.ok) {
//             throw new Error("No more shows available");
//         }

//         const data = await response.json();

//         status.textContent = "All TV Shows";

//         data.forEach(show => {
//             const name = show.name;

//             const image = show.image?.medium ?? "images/no_image.png";

//             const rating = show.rating?.average ?? "No Rating";

//             card_layout(name, image, rating);
//         });

//         // Update pagination
//     //     const buttons = pagination.querySelectorAll("button");
//     //     const previousBtn = buttons[0];
//     //     const nextBtn = buttons[1];
//     //     const pageNumber = pagination.querySelector("span");

//     //     previousBtn.disabled = currentPage === 0;
//     //     pageNumber.textContent = `Page ${currentPage + 1 }`;

//     } catch (error) {
//         console.log(error);

//         err.textContent = "Unable to load shows. Try again.";
//         err.style.color = "red";

//         // // Don't go beyond the last available page
//         // if (currentPage > 0) {
//         //     currentPage--;
//         // }
//     }
// }

// create_pagination();
// load_all_shows();

homePage_movie();

//display_fav();