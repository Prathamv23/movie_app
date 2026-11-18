import { doc_elements } from "./functions/elements.js";
import { fetch_rsponse } from "./api/api_fetch.js";



const {input,submit,form,movie_card,status,err} = doc_elements();


let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function save_favorites(){
    localStorage.setItem("favorites",JSON.stringify(favorites));
    console.log(favorites);
}


async function get_movie(m_name){

    try{
        movie_card.innerHTML = "";
        
        const data = await fetch_rsponse(m_name);

        if(data){
            status.textContent = await "Best Results";
            err.textContent = "";
            console.log(data);
            const name = data.name;

            const image = data.image?.medium ?? "images/no_image.png";
            
            const rating = data.rating?.average ?? "No Rating";

            display(name,image,rating);
            return data;
        }
        else{
            status.textContent = "";
            err.textContent = "404 movie not available";
            err.style.color = "red";
            err.style.fontSize = "34px"
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
    
        <a href="movie_detail.html?q=${name}"style="cursor: pointer" target = "_blank"><img src="${image}" alt="${name}"></a>
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
            favorites.push({
                "name": name,
                "image": image,
                "rating": rating,
                "isLiked": true
            });
        } else {
            favorites = favorites.filter(item => item.name !== name);
            display_fav();
        }
        save_favorites();
    });

    movie_card.appendChild(card);
}


function display_fav(){
    movie_card.innerHTML = "";
    status.textContent = "Favorites";
    err.textContent = "";
    favorites.forEach(fav => card_layout(fav.name, fav.image, fav.rating));
  
}

function display(name,image,rating){

    // movie_list.innerHTML = "";

    // const li = document.createElement("li");
   
    // li.textContent = name;
    // console.log(name,image,rating);
    // movie_list.appendChild(li);


    // favorites.forEach(ele => {
    //    const li = document.createElement("li");
    //    li.className = "m-list";
       
    //    const m_name = document.createElement("span");
    //    m_name.textContent = ele.name;
    // }); 

    movie_card.innerHTML = "";
    card_layout(name, image, rating);

}

form.addEventListener("submit",(e)=>{
    e.preventDefault();

    const movie_name = input.value.replace(" ","%20");
    console.log(movie_name);

    get_movie(movie_name);
    
});

input.addEventListener("input", () => {
    if (input.value.trim() === "") {
        status.textContent="";
        display_fav();
    }
});

display_fav();