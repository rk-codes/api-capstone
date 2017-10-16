const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";
const MAP_CENTER = "https://maps.googleapis.com/maps/api/geocode"
let map;
let infowindow;
let inputLocation;

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
  $('.search-box').hide();
  const params= {
      "location.address": `${location}`,
      token: API_KEY
     }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,callback);
  //displayMap(location);  

}

function displayMap(location){

  //$('.map').show();
  $.getJSON(`${MAP_CENTER}/json?address=${location}`,function (data){
      console.dir(data);
      initMap(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
          
   });

}
// Success callback. Pass the data recieved to next request to collect venue details
function getDataOfEvents(data) {
    $('.search-box').hide();
    $('.result-section').show();
    $('.events-list').show();
    displayMap(inputLocation);
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
     eventData.latitude = data.latitude;
     eventData.longitude = data.longitude;
     console.log(eventData);
     renderEventInfo(eventData);
          
     addMarkerToMap(eventData.latitude, eventData.longitude,eventData.address);
   });
 }


// This function renders the DOM with the event data
function renderEventInfo(eventResult){
  let eventName = eventResult.name.text;
  let eventDescription = eventResult.description.text;
  let eventDetailsUrl = eventResult.url;
  let eventLogo = eventResult.logo.original.url;
  let fromDate = eventResult.start.local;
  let toData = eventResult.end.local;
  let eventAddress = eventResult.address;
  console.log(`Event start: ${fromDate}`);
  console.dir(fromDate);
  console.log(new Date(fromDate));
  let eventDate = new Date(fromDate);

  $('.events-list').append(`
     <div class="js-eventInfo">
      <div class="js-img-box">
       <img class="js-event-image" src="${eventLogo}">
       <span class="js-event-date">${eventDate}</span>
      </div>
       
       <h4 class="js-event-name">${eventName}</h4>
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
    getEventsByLocation(inputLocation, getDataOfEvents);
    
  })
}

// Add marker to google map
function addMarkerToMap(eLat, eLong, venAddress) {
  //let eventLatLng = new google.maps.LatLng(lat, long);
  console.log({lat: eLat, lng: eLong});
  let marker = new google.maps.Marker({
        position: {lat: Number(eLat), lng: Number(eLong)},
        map: map
  });
 
  google.maps.event.addListener(marker, 'click', (function (marker) {
      return function () {
        infowindow.setContent(venAddress);
        infowindow.open(map, marker);
      };
    })(marker));
}



// Google Map
function initMap(lat, lng){
  $('.map').show();
  console.log("Init Map");
  console.log(lat);
  console.log(lng);
  let options = {
    zoom: 10,
     //center: {lat: lat, lng: lng}
  }
   map = new google.maps.Map(document.getElementById('map'),options);
   //google.maps.event.trigger(map, 'resize');
   map.setCenter(new google.maps.LatLng(lat, lng));

   infowindow = new google.maps.InfoWindow({});

}


function init(){
  handleSearchClick();
  $('.events-list').hide();
  $('.result-section').hide();
  let input = document.getElementById('autocomplete');
  let autocomplete = new google.maps.places.Autocomplete(input);
}
$(init());