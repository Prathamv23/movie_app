
export function doc_elements(){
    //const api = "https://api.tvmaze.com/singlesearch/shows?q=dexter"

    const input = document.querySelector("#inp");
    const submit = document.querySelector("#sub");
    const form = document.querySelector("#form");
    const movie_card = document.querySelector("#movie-card");
    const status = document.querySelector("#status");
    const err = document.querySelector("#err");

    return {input,submit,form,movie_card,status,err};
};

//module.export = {doc_elements};




