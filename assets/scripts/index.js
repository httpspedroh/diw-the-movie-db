const API_KEY = 'b26e0911c4b7bea35c2a7b45955a91bb';

loadMovieData();

// ------------------------------------------------------------------------------------------------------------------ //

var xhrIndex,
    querySearch = sessionStorage.getItem('searchQuery');

document.getElementById('search-button').addEventListener('click', searchMovie);

if(querySearch != null) document.getElementById('search-input').value = querySearch;

// ------------------------------------------------------------------------------------------------------------------ //

function loadMovieData() {

    xhrIndex = new XMLHttpRequest();
    xhrIndex.onload = showPopularMovies;
    xhrIndex.open('GET', `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&region=BR`);
    xhrIndex.send();
}

// ------------------------------------------------------------------------------------------------------------------ //

function showPopularMovies() {

    if(xhrIndex.status == 404) 
    {
        return bootbox.alert({
            closeButton: false,
            message: `Ocorreu um erro ao carregar a página inicial! (Código: 0x01)`,
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

        let moviesCarIndicators = document.getElementById('moviesCarIndicators'); textCarIndicators = '';
        let moviesCarItems = document.getElementById('moviesCarItems'); textCarItems = '';
        let data = JSON.parse(this.responseText);
        
        for(let i = 0; i < data.results.length; i++) {

            let movie = data.results[i];

            textCarIndicators += `<button type="button" data-bs-target="#movies" data-bs-slide-to="${i}"${i == 0 ? ' class="active"' : ''} aria-current="true" aria-label="Slide 1"></button>`;

            textCarItems += `<div class="carousel-item${i == 0 ? ' active' : ''}" data-bs-interval="15000">
                                <div class="index_movieRow row align-items-center justify-content-center">
                                    <div class="col-lg-6 col-xl-4 text-center">
                                        <img class="general_movieImg" src="${'https://image.tmdb.org/t/p/w500/' + movie.poster_path}" alt="${movie.title}">
                                    </div>

                                    <div class="col-lg-5 col-xl-7">
                                        <h1 id="index_movieName" class="index_movieName text-center text-lg-start">${movie.title + ` <div class="index_originalTitle">(${movie.original_title})</div>`}</h1>

                                        <div class="index_overview">${movie.overview}</div>
                                        
                                        <div class="text-center text-lg-start"><button type="button" class="btn general_button" onclick="viewMovieDetails(${movie.id})"><i class="fas fa-plus"></i>Ver detalhes</button></div>
                                    </div>
                                </div>
                            </div>`;
        }

        // -------- //

        moviesCarIndicators.innerHTML = textCarIndicators;
        moviesCarItems.innerHTML = textCarItems;

        document.getElementById('main').style.display = "block";
        document.getElementById('footer').style.display = "block";
    }
}

// ------------------------------------------------------------------------------------------------------------------ //

function viewMovieDetails(movieId) {

    sessionStorage.setItem('searchId', movieId);

    location.href = 'detalhes.html';
}

// ------------------------------------------------------------------------------------------------------------------ //

function searchMovie() {

    let inputValue = document.getElementById('search-input').value;

    sessionStorage.setItem('searchQuery', inputValue);
    
    location.href = 'pesquisa.html';
}