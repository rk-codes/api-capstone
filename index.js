const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";
let map;
let inputLocation;

let eventData = {};
let eventsArray = [];
//This function retrieves the categories of the events
function getCategoriesFromApi(endpoint, callback){
  const params= {
    token: API_KEY
  }
  // $.getJSON(`${EVENTBRITE_URL}/${endpoint}/`,params,logData);
}
//getCategoriesFromApi("categories",logData);


// Calls the api to get the events in the given location
function getEventsByLocation(location, callback){
  const params= {
    "location.address": `${location}`,
    token: API_KEY
  }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,callback);

}

// Success callback. Pass the data recieved to next request to collect venue details
function getDataOfEvents(data) {
   $('.search-box').hide();
   data.events.forEach((event) =>{
    getEventVenueDetails(event);
  });
}

// This function makes ajax request to get the venue information
function getEventVenueDetails(eventData){
  console.log(" Enter getEventVenueDetails Venue Id: " + eventData.venue_id);
  const params= {
     token: API_KEY
   }
   let id = eventData.venue_id;
   $.getJSON(`${EVENTBRITE_URL}/venues/${id}/`, params, function(data){
     console.log("success call back venue");
     console.log(data.address.localized_address_display);
     eventData.address = data.address.localized_address_display;
     console.log(eventData);
     renderEventInfo(eventData);
   });
}


// This function renders the DOM with the event data
function renderEventInfo(eventResult){
  $('.result-section').show();
  $('.events-list').show();
  $('.map').show();
  initMap();
  let eventName = eventResult.name.text;
  let eventDescription = eventResult.description.text;
  let eventDetailsUrl = eventResult.url;
  let eventLogo = eventResult.logo.original.url;
  let fromDate = eventResult.start.local;
  let toData = eventResult.end.local;
  let eventAddress = eventResult.address;

  $('.events-list').append(`
     <div class="js-eventInfo">
       <img class="event-image" src="${eventLogo}">
       <h5 class="event-name">${eventName}</h5>
       <span>${eventAddress}</span>
       <a href="${eventDetailsUrl}" class="event-details">More..</a> 
     </div>`)

}

// Function called when user enters the location and press search button
function handleSearchClick() {
  console.log("Enter handleSearchClick ");
  $('.search-button').on('click', function (event){
    event.preventDefault();
    inputLocation = $('.user-location').val();
    $('.location-box').show();
    $('.location-box').append(`<span class="current-location">Upcoming events in ${inputLocation}`);
    getEventsByLocation(inputLocation,getDataOfEvents);
   })
  
}

// Google Map
function initMap(){

  console.log("Init Map");
  let options = {
    zoom: 8,
    // center: {lat: 37.6213, lng: -37.6213}
  }
   map = new google.maps.Map(document.getElementById('map'),options);
   google.maps.event.trigger(map, 'resize');
    map.setCenter(new google.maps.LatLng(38.9072,-77.0369));
}


function init(){
  handleSearchClick();
  $('.events-list').hide();
  $('.result-section').hide();
 
}
$(init());