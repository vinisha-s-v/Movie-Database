let movieNameInp = document.getElementById('movieName');
let searchButton = document.getElementById('srch-btn');
let resultDiv = document.getElementById('result');
let loadingDiv = document.getElementById('loading');
let selectedmovieDiv=document.getElementById('selectedMovie');
let trailerDiv=document.getElementById('movieTrailer');

let url = 'https://api.themoviedb.org/3'
let key = "6ca75a6293fa4bd6e65169fa96401173";


searchButton.addEventListener('click', async () => {


  showLoading();
  await movieDetail();
  hideLoading();
  

  movieNameInp.value = '';
  selectedmovieDiv.style.display='none';
  trailerDiv.style.display='none';
});
//let filimName =movieNameInp.value;
//filimName='';


//..........api fetching function.........
async function movieDetail() {
  console.log("Worked")
  let filimName = movieNameInp.value;



  let configRespnse = await fetch(`${url}/configuration?api_key=${key}`)
  console.log(configRespnse)
  let configdata = await configRespnse.json()
  console.log(configdata)
  let imageBase = configdata.images.base_url;
  console.log(imageBase)


  if (filimName.length <= 0) {
    resultDiv.innerHTML = `<h3 class="msg"> please enter a movie name<h3>`
  }
  else {
    try {

      let response = await fetch(`${url}/search/movie?api_key=${key}&query=${filimName}`)
      let data = await response.json()
      console.log("vinisha", data)
      console.log("yooo", data.results)

      displayMovie(data.results, imageBase)


    } catch (err) {
      console.log("Err or fetching" + err)
    }
  }



}

function showLoading() {
  loadingDiv.style.display = 'block';
}

function hideLoading() {
  loadingDiv.style.display = 'none';
}


function displayMovie(movies, imageurl) {

  // selectedmovieDiv.innerHTML='';
  resultDiv.style.display='flex'
  resultDiv.innerHTML = '';
  movies.forEach((item) => {
    let MovieContainer = document.createElement('div')
    MovieContainer.classList.add('movieContainer')
    MovieContainer.innerHTML += `<img src="${imageurl}/w500/${item.poster_path}" alt="${movies.title}">
                                 <h3>Title:${item.title}</h3>
                                 <p>Released On:${item.release_date}</p>
                                 <h6>Overview:${item.overview}</h6>
                                 <p>Rating:${item.vote_average}</p>
                                  `
    MovieContainer.addEventListener('click', () => {
      showMovie(item.id)
    })

    resultDiv.appendChild(MovieContainer)
// Hide loading 
hideLoading();
  })


}
async function showMovie(filimId) {
  trailerDiv.style.display='block'

  selectedmovieDiv.style.display='flex'
  let configRespnse = await fetch(`${url}/configuration?api_key=${key}`)
  console.log(configRespnse)
  let configdata = await configRespnse.json()
  console.log(configdata)
  let imageBase = configdata.images.base_url;
  console.log(imageBase)

  resultDiv.style.display = 'none'
  //to get details based on filimId
  let movieDetailsUrl = `${url}/movie/${filimId}?api_key=${key}`;
  let moviedetailsresponse = await fetch(movieDetailsUrl)
  let movieconfg = await moviedetailsresponse.json()
  console.log(movieconfg)
  //get deatils about director etc
  let CreditDetailsUrl = `${url}/movie/${filimId}/credits?api_key=${key}`;
  let Creditdetails = await fetch(CreditDetailsUrl)
  let CreditConfig = await Creditdetails.json()
  console.log(CreditConfig)
  //to get trailer link
  let trailerUrl = `${url}/movie/${filimId}/videos?api_key=${key}`;
  let trailerresponse = await fetch(trailerUrl);
  let traileedata = await trailerresponse.json();
  console.log( traileedata)
  let trailerkey = traileedata.results.length > 0 ? traileedata.results[0].key : null


  let moviecontent = document.getElementById('movieContent');
  let movieimage = document.getElementById('movieImage');
  let Trailer = document.getElementById('movieTrailer')



  movieimage.innerHTML = `<img src="${imageBase}/w500/${movieconfg.poster_path}" alt="${movieconfg.title}">`

  moviecontent.innerHTML += `
              <h3>Title:${movieconfg.title}</h3>
              <p>Released On:${movieconfg.release_date}</p>
              <h6>Overview:${movieconfg.overview}</h6>
              <p>Rating:${movieconfg.vote_average}</p>
              <h3>Director:${getDirectorName(CreditConfig.crew)}</h3>
              <p>cast:${getCastNames(CreditConfig.cast)}</p>
             
   `
  Trailer.innerHTML = ` <b>Trailer:<br></b>${trailerkey ? `<iframe width="80%" height="400px" src='https://www.youtube.com/embed/${trailerkey}'</iframe>` : 'Trailer Not Available '}`

}
function getDirectorName(crewDetails) {
  let director = crewDetails.find(person => person.job === "Director");


  return director ? director.name : "Director not available";

}

function getCastNames(castDetails) {

  let castNames = castDetails.slice(0, 5).map(member => member.name + ' as : ' + member.character);
  return castNames;
}
let castSelect = document.getElementById('cast-selection');
castSelect.addEventListener('change', function () {
  filterMoviesByCast();
});
//fech cast
async function filterMoviesByCast() {
  let configRespnse = await fetch(`${url}/configuration?api_key=${key}`)
  console.log(configRespnse)
  let configdata = await configRespnse.json()
  console.log(configdata)
  let imageBase = configdata.images.base_url;
  console.log(imageBase)
  try {
    let selectedCast = document.getElementById('cast-selection').value;
    let filterCastUrl = `${url}/search/person?api_key=${key}&query=${selectedCast}`;
    let filtercastDetails = await fetch(filterCastUrl);




    let data = await filtercastDetails.json();


    if (data.results && data.results.length > 0) {
      const cast_id  =data.results[0].id                                                                                                                                                                                                                                                                                                                                                                                                                                                                     = data.results[0].id;

      let movieResponse = await fetch(`${url}/discover/movie?api_key=${key}&with_cast=${cast_id}`);
      let movieDetail = await movieResponse.json();
      console.log(movieDetail.results);

      if (movieDetail.results && movieDetail.results.length > 0) {
        // let imageBaseUrl = ''; // You may need to get the correct property from your API response
        displayMovie(movieDetail.results, imageBase);
      } else {
        // No movies found for the selected cast
        // Nomoviefound();
      }
    } else {
      // No results found for the selected cast
      // Nomoviefound();
    }

  } catch (err) {
    console.error(err);
    //Nomoviefound();
  }
} 