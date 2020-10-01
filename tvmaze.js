/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  //Make an ajax request to the searchShows api. 
  const response = await axios.get("http://api.tvmaze.com/search/shows", { params: { q: query }});

  let shows = response.data.map((data) => ({
    id: data.show.id,
    name: data.show.name,
    summary: data.show.summary,
    image: (data.show.image) ?
            data.show.image.medium : "https://tinyurl.com/tv-missing",
  }));

  return shows;

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary: "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
  //     image: "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}



// /** Populate shows list:
//  *     - given list of shows, add shows to DOM
//  */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class=" card-group col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card mb-3 overflow-auto" style=" height: 40rem" data-show-id="${show.id}"> 
            <img class="card-img-top mt-0 mb-2" src=${show.image}>            
            <div class="card-body"> 
              <button class="btn btn-success float-right showEpiBtn">Episodes</button>           
              <h5 class="card-title">${show.name}</h5>
              <p class="card-text">${show.summary}</p>              
           </div> 
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}
// /** Handle search form submission:
//  *    - hide episodes area
//  *    - get list of matching shows and show in shows list
//  */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows); 
});


// /** Given a show ID, return list of episodes:
//  *      { id, name, season, number }
//  */

async function getEpisodes(id) {
  // get episodes from tvmaze
  // you can get this by making GET request to
  // http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  //return array-of-episode-info, as described in docstring above
  let episodesArr = episodes.data.map((data) => ({
    id: data.id,
    name: data.name,
    season: data.season,
    number: data.number
  }))

  return episodesArr;  
}

function populateEpisodes(episodes) {
  // $("#episodes-area").css("display", "none");
  for (let epi of episodes) {
    let $li = $(`<li>${epi.name} (season ${epi.season}, episode ${epi.number})</li>`);
    $("#episodes-list").append($li);
  }
  $("#episodes-area").css("display", "block");
}


// handle get Episodes button
$("#shows-list").on("click", ".showEpiBtn", async function(e) {  
  $("#episodes-list").empty();
  let showId = $(e.target).parent().parent().data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);  
})

