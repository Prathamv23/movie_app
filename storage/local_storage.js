export let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

export function save_favorites() {
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log("Saved:", favorites);
}

export function add_favorite(movie) {
    
    if (!favorites.some(item => item.name === movie.name)) {
        favorites.push(movie);
        save_favorites();
    }
}

export function remove_favorite(movieName) {
    favorites = favorites.filter(item => item.name !== movieName);
    save_favorites();
}
