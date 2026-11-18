export function storage(){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites;
}



