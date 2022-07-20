const API_KEY = 'b26e0911c4b7bea35c2a7b45955a91bb';

loadMovieSearch();

// ------------------------------------------------------------------------------------------------------------------ //

var xhrSearch,
    querySearch = sessionStorage.getItem('searchQuery');

document.getElementById('search-button').addEventListener('click', searchMovie);

if(querySearch != null) document.getElementById('search-input').value = querySearch;

// ------------------------------------------------------------------------------------------------------------------ //

function loadMovieSearch() {

    xhrSearch = new XMLHttpRequest();
    xhrSearch.onload = showMovieList;
    xhrSearch.open('GET', `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${sessionStorage.getItem('searchQuery')}`);
    xhrSearch.send();
}

// ------------------------------------------------------------------------------------------------------------------ //

function showMovieList() {

    if(xhrSearch.status == 404) 
    {
        return bootbox.alert({
            closeButton: false,
            message: `Ocorreu um erro ao carregar a página de pesquisa! (Código: 0x03)`,
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

        let data = JSON.parse(this.responseText);

        if(data.results.length == 0) {

            return bootbox.alert({
                closeButton: false,
                message: `Nenhum resultado encontrado para "${sessionStorage.getItem('searchQuery')}"!`,
                size: 'small',
                buttons: {
                    ok: {
                        className: 'btn-dark',
                        label: 'Voltar à página inicial',
                    },
                },
                callback: function() { location.href = '/' },
            });
        }
        else {
        
            let pesquisa_movieData = document.getElementById('pesquisa_movieData'); text = '';

            for(let i = 0; i < data.results.length; i++) {

                let movie = data.results[i];
                let movieDate = new Date(movie.release_date);
                let overview = movie.overview.length <= 320 ? ((movie.overview == null || movie.overview.length == 0) ? '<i>Nenhuma sinopse adicionada.</i>' : movie.overview) : movie.overview.slice(0, 320) + '...';

                text += `<span class="pesquisa_movieCard col-12 col-xl-6 d-flex justify-content-center">
                            <div class="card bg-light mb-3">
                                <div class="pesquisa_movieName card-header">
                                    <i class="fa-solid fa-clapperboard"></i><b>${movie.title}</b>  <span class="pesquisa_movieYear">${movieDate.isValid() ? '(' + movieDate.getUTCFullYear() + ')' : ''}</span>
                                </div>
                                <div class="card-body">
                                    <div class="row g-0">
                                        <div class="col-12 col-sm-4">
                                            <span class="pesquisa_movieImg"><img src="${(movie.poster_path == null || movie.poster_path.length == 0) ? '/assets/images/no_image.jpg' : 'https://image.tmdb.org/t/p/w500/' + movie.poster_path}" class="img-fluid rounded" alt="${movie.title}"></span>
                                        </div>

                                        <div class="col-sm-1"></div>

                                        <div class="pesquisa_movieDetails col-12 col-sm-7">
                                            <p class="pesquisa_movieOverview card-text"><b>Sinopse: </b>${overview}</p>

                                            <p class="pesquisa_movieDate card-text">
                                                <b>Data de lançamento: </b>${movieDate.isValid() ? movieDate.toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'N/A'}<br>
                                            </p>
                                            
                                            <span class="pesquisa_movieButton">
                                                <button class="btn" onclick="viewMovieDetails(${movie.id})"><i class="fa-solid fa-circle-info"></i>Ver detalhes</a></button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </span>`;
            }
        }

        pesquisa_movieData.innerHTML = text;

        // -------- //

        document.getElementById('main').style.display = "block";
        document.getElementById('footer').style.display = "block";
    }
}

// ------------------------------------------------------------------------------------------------------------------ //

Date.prototype.isValid = function () {
    return this.getTime() === this.getTime();
};  

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