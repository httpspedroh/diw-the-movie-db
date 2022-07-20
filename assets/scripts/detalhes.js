const API_KEY = 'b26e0911c4b7bea35c2a7b45955a91bb';

loadMovieDetails();

// ------------------------------------------------------------------------------------------------------------------ //

var xhrDetails,
    querySearch = sessionStorage.getItem('searchQuery');

document.getElementById('search-button').addEventListener('click', searchMovie);

if(querySearch != null) document.getElementById('search-input').value = querySearch;

// ------------------------------------------------------------------------------------------------------------------ //

function loadMovieDetails() {

    xhrDetails = new XMLHttpRequest();
    xhrDetails.onload = showMovieDetails;
    xhrDetails.open('GET', `https://api.themoviedb.org/3/movie/${sessionStorage.getItem('searchId')}?api_key=${API_KEY}&language=pt-BR`);
    xhrDetails.send();
}

// ------------------------------------------------------------------------------------------------------------------ //

function showMovieDetails() {

    if(xhrDetails.status == 404) 
    {
        return bootbox.alert({
            closeButton: false,
            message: `Ocorreu um erro ao carregar os dados do filme ${sessionStorage.getItem('searchId')}! (Código: 0x02)`,
            size: 'small',
            buttons: {
                ok: {
                    className: 'btn-dark',
                    label: 'Fechar',
                },
            },
        });
    }
    else {

        let movieData = document.getElementById('detalhes_movieData'); text = '';
        let movie = JSON.parse(this.responseText);
        let movieDate = new Date(movie.release_date);

        text += `<div class="detalhes_movieRow row align-items-center justify-content-center">
                    <div class="col-lg-6 col-xl-4 text-center">
                        <img class="general_movieImg" src="${(movie.poster_path == null || movie.poster_path.length == 0) ? '/assets/images/no_image.jpg' : 'https://image.tmdb.org/t/p/w500/' + movie.poster_path}" alt="${movie.title}">
                    </div>

                    <div class="col-lg-6 col-xl-8">
                        <div class="detalhes_movieName text-center text-lg-start">${movie.title} <span class="detalhes_movieYear">${movieDate.isValid() ? '(' + movieDate.getUTCFullYear() + ')' : ''}</span> 
                            <div class="detalhes_movieInfo">${movieDate.isValid() ? movieDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}`;
                        
        for(let i = 0; i < movie.genres.length; i++) {

            if(i == 0) text += `   •   `;
            
            let genre = movie.genres[i];
            text += `<a href="https://www.themoviedb.org/genre/${genre.id + '/movie'}" target="_blank">${genre.name}</a>${i < movie.genres.length - 1 ? ', ' : ''}`;
        }
                          
        let hours = Math.floor(movie.runtime / 60);
        let minutes = movie.runtime % 60;
        let language;
        
        if(movie.spoken_languages.length == 0) language = 'N/A';
        else if(movie.spoken_languages[0].iso_639_1 == 'xx') language = 'Sem falas';
        else language = new Intl.DisplayNames(['pt-BR'], {type: 'language'}).of(movie.spoken_languages[0].iso_639_1);
        
        language = language.charAt(0).toUpperCase() + language.slice(1);

        text += ` </div></div>

                    <div class="text-center text-lg-start">
                        <span class="detalhes_movieCards"><i class="fas fa-star"></i><span>${movie.vote_average} / 10</span></span>
                        <span class="detalhes_movieCards"><i class="fa-solid fa-language"></i><span>${language}</span></span>
                        <span class="detalhes_movieCards"><i class="fas fa-clock"></i><span>${hours == 0 ? (minutes == 0 ? 'N/A' : minutes + 'm') : (hours + 'h ' + (minutes == 0 ? '' : minutes + 'm'))}</span></span>
                    </div>

                    <div class="detalhes_movieOverview"><b>Sinopse:</b> ${(movie.overview == null || movie.overview.length == 0) ? '<i>Nenhuma sinopse adicionada.</i>' : movie.overview}</div>

                    <div class="text-center text-lg-start">
                        <a type="button" class="btn general_button" href="https://www.themoviedb.org/movie/${movie.id}" target="_blank"><i class="fa-solid fa-clapperboard"></i>Ver página do filme</a>
                        ${movie.belongs_to_collection != null ? '<a type="button" class="btn general_button" href="https://www.themoviedb.org/collection/' + movie.belongs_to_collection.id + '" target="_blank"><i class="fa-solid fa-clapperboard"></i>Ver coleção</a>' : ''}
                        
                        ${(movie.homepage == null || movie.homepage.length == 0) ? '' : '<a type="button" class="btn general_button" href="' + movie.homepage + '" target="_blank"><i class="fas fa-globe"></i>Visitar site</a>'}
                    </div>
                </div></div>`;

        // -------- //

        movieData.innerHTML = text;

        document.getElementById('sec_movie').style =   `margin: 30px 15px;
                                                        background:
                                                        linear-gradient(
                                                            rgba(0, 0, 0, 0.8),
                                                            rgba(0, 0, 0, 0.8)
                                                        ),
                                                        ${movie.backdrop_path != null ? ('url(\'https://image.tmdb.org/t/p/w500/' + movie.backdrop_path + '\');') : ''}
                                                        background-size: cover;
                                                        border-radius: 20px;
                                                        background-color: #585858;`;

        document.getElementById('main').style.display = "block";
        document.getElementById('footer').style.display = "block";
    }
}

// ------------------------------------------------------------------------------------------------------------------ //

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};  

// ------------------------------------------------------------------------------------------------------------------ //

function searchMovie() {
    
    let inputValue = document.getElementById('search-input').value;

    sessionStorage.setItem('searchQuery', inputValue);
    
    location.href = 'pesquisa.html';
}