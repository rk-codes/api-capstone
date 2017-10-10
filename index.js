const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";


//This function retrieves the categories of the events
function getCategoriesFromApi(endpoint, callback){
  const params= {
    token: API_KEY
  }
  // $.getJSON(`${EVENTBRITE_URL}/${endpoint}/`,params,logData);
}
//getCategoriesFromApi("categories",logData);

function getEventsByLocation(location, callback){
  const params= {
    "location.address": `${location}`,
    token: API_KEY
  }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,callback);

}

function renderEventInfo(result) {
  $('.result-section').show();
  $('.location-box').show();
  $('.events-list').show();
  $('.map').show();
  let eventName = result.name.text;
  let eventDescription = result.description.text;
  let eventDetailsUrl = result.url;
  let eventLogo = result.logo.original.url;
  let fromDate = result.start.local;
  let toData = result.end.local;
  let venueId = result.venue_id;
  
  getEventVenueDetails(venueId,logData);

  $('.events-list').append(`
    <div class="js-eventInfo">
      <img class="event-image" src="${eventLogo}">
      <h5 class="event-name">${eventName}</h5>
      <a href="${eventDetailsUrl}" class="event-details">More Details</a> 
    </div>`)
}

// Displays the details of the events retrieved
function displayEvents(data) {
  console.log("displayEvents");

  const results = data.events.map((item,index) => renderEventInfo(item));
  $('.search-box').hide();
}

// Function called when user enters the location and press search button
function handleSearchClick() {
  $('.search-button').on('click', function (event){
    event.preventDefault();
    let location = $('.user-location').val();
    console.log("Location: "+ location);
    getEventsByLocation(location,displayEvents);
   })
 
}

// Get the venue details of each event retrieved
function getEventVenueDetails(id,callback){
  // console.log(" getEventVenueDetails Venue Id: "+id);
  const params= {
    token: API_KEY
  }
   $.getJSON(`${EVENTBRITE_URL}/venues/${id}/`,params,callback);
}
function logData(data){
  console.log("Success");
}

// Google Map
function initMap(){
  console.log("Init Map");
  let options = {
    zoom: 8,
    center: {lat: 37.7749, lng: -122.4194}
  }
  let map = new google.maps.Map(document.getElementById('map'),options);
}


function init(){
  handleSearchClick();
  $('.events-list').hide();
  $('.result-section').hide();
}
$(init());