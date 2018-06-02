const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

const query = {
    part: 'snippet',
    key: 'AIzaSyDkHhyLQUIHWTPfgMpTNm0JVTxGF_mZCoc',
    'type': 'video',
    maxResults: 5,
  }

  let nextPageToken;
  let prevPageToken;

function getDataFromApi(searchTerm, callback) {
  query.q = `${searchTerm}`;
  console.log(query);
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  console.log('getData ran');
}

function getNextPage(callback) {
  query.pageToken = nextPageToken;
  console.log(query);
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  console.log('getNextPage ran');
}

function getPrevPage(callback) {
  query.pageToken = prevPageToken;
  console.log(query);
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
  console.log('getPrevPage ran');
}

function renderSearchResults(item, index) {
//html to insert
if (index < 2) {
  //col-6
  console.log('render 1 and 2 ran');
  return `<div class='col-6'>
            
              <a href='https://www.youtube.com/watch?v=${item.id.videoId}' target="_blank">
              <img src=${item.snippet.thumbnails.medium.url} alt="thumbnail for ${item.snippet.title}">
              </a>
          </div>`;
} else {
  //col-4
  console.log('render 345 ran');
   return `<div class='col-4'>
            
              <a href='https://www.youtube.com/watch?v=${item.id.videoId}' target="_blank">
              <img src=${item.snippet.thumbnails.medium.url} alt="thumbnail for ${item.snippet.title}">
              </a>
          </div>`;
}
}

function displayResults(youtubeResults) {
//map array to create results and insert

const totalCount = youtubeResults.pageInfo.totalResults;

$('.searchDisplay').prepend(totalCount + ' ');
  const displayArray = youtubeResults.items.map((item, index) => renderSearchResults(item, index));
  nextPageToken = youtubeResults.nextPageToken;
  console.log(nextPageToken);
  $('.searchResults').prop('hidden', false).html('<div class=\'row\'>' + displayArray[0] + displayArray[1] + '</div><div class=\'row\'>' + displayArray[2] + displayArray[3] + displayArray[4] + '</div>');
  $('.nextForm').prop('hidden', false).html('<button type="submit" id="nextPageButton">More >>></button>');
  console.log('displayResults ran');
}

function displayMoreResults(youtubeResults) {
//map array to create results and insert after 1st page 
  const displayArray = youtubeResults.items.map((item, index) => renderSearchResults(item, index));
  nextPageToken = youtubeResults.nextPageToken;
  prevPageToken = youtubeResults.prevPageToken;
  console.log(nextPageToken + ' & ' + prevPageToken);

  $('.searchResults').html('<div class=\'row\'>' + displayArray[0] + displayArray[1] + '</div><div class=\'row\'>' + displayArray[2] + displayArray[3] + displayArray[4] + '</div>');
  if (prevPageToken !== undefined){
  $('.nextForm').html('<button type="submit" id="prevPageButton"><<< Prev</button><button type="submit" id="nextPageButton">More >>></button>');
} else {
   $('.nextForm').html('<button type="submit" id="nextPageButton">More >>></button>');
}
  console.log('displayResults ran');
}

//On submit of More button retrieve next results using pageToken
function handleMoreButton() {
  $('.nextForm').on('click','#nextPageButton', event => {
    event.preventDefault();
    console.log('handleMoreButton ran');
    getNextPage(displayMoreResults);
  });
}

function handlePrevButton() {
  $('.nextForm').on('click','#prevPageButton', event => {
    event.preventDefault();
    //add if statement if there is not prevPageToken
    console.log('handlePrevButton ran');
    getPrevPage(displayMoreResults);
  });
}

function handleSearch() {
  $('.searchForm').submit(event => {
    event.preventDefault();
    delete query.pageToken;
    nextPageToken = null;
    prevPageToken = null;
    const userInput = $(event.currentTarget).find('.searchInput');
    const searchFor = userInput.val();

     $('.searchDisplay').html(searchFor + ' videos');
    console.log(searchFor);

    userInput.val('');
    getDataFromApi(searchFor, displayResults);
  });
}

function startPage() {
  handleSearch();
  handleMoreButton();
  handlePrevButton();
}

$(startPage);

