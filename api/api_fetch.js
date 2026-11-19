

export async function fetch_rsponse(m_name){
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${m_name}`);

    if(!response.ok){
        return null;
    }

    return response.json();
}