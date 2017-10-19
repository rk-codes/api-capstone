const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";
const MAP_URL = "https://maps.googleapis.com/maps/api/geocode"
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
  const params= {
      "location.address": `${location}`,
      token: API_KEY
     }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,callback);
}

function displayMap(location){
  $.getJSON(`${MAP_URL}/json?address=${location}`,function (data){

      initMap(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
          
   });

}
// Success callback. Pass the data recieved to next request to collect venue details
function getDataOfEvents(data) {
    $('#loading').hide();
    $('.result-section').show();
    displayMap(inputLocation);
    data.events.forEach((event) =>{
    getEventVenueDetails(event);
  });
}

// This function makes ajax request to get the venue information
function getEventVenueDetails(eventData){
  
  const params= {
     token: API_KEY
   }
  let id = eventData.venue_id;
  $.getJSON(`${EVENTBRITE_URL}/venues/${id}/`, params, function(data){
     eventData.address = data.address.localized_address_display;
     eventData.latitude = data.latitude;
     eventData.longitude = data.longitude;
     console.log(eventData);
     renderEventInfo(eventData);
          
     addMarkerToMap(eventData);
   });
 }


// This function renders the DOM with the event data
function renderEventInfo(eventResult){
  let eventName = eventResult.name.text;
  let eventDescription = eventResult.description.text;
  let eventDetailsUrl = eventResult.url;
  let eventLogo = eventResult.logo? eventResult.logo.original.url: "";
  let fromDate = eventResult.start.local;
  let toData = eventResult.end.local;
  let eventAddress = eventResult.address;
  let eventDate = new Date(fromDate);
  let options = {
    weekday: 'long', 
    year: 'numeric', 
    month: 'short', 
    day: '2-digit'
  }
  let dateFormatter = Intl.DateTimeFormat("en-us", options);
  let timeFormatter = Intl.DateTimeFormat("en-us", {
    hour: '2-digit', 
    minute: '2-digit'
  });

  $('.events-list').append(`
     <div class="js-eventInfo">
      <div class="js-img-box">
        <img class="js-event-image" src="${eventLogo}">
        <span class="js-event-date">
          ${dateFormatter.format(eventDate)}
          <br/>
          ${timeFormatter.format(eventDate)}
        </span>
      </div>
       
       <span class="js-event-name">${eventName}</span>
       <p>${eventAddress}</p>
       <a href="${eventDetailsUrl}" class="event-details" target="_blank">More..</a> 
     </div>`)

}

// Function called when user enters the location and press search button
function handleSearchClick() {
    $('.search-button').on('click', function (event){
    event.preventDefault();
    inputLocation = $('.user-location').val();
    $('.search-box').hide();
    $('#loading').show();
    $('.location-box').show();
    $('.location-box').append(`
      <span class="current-location">Upcoming events in <strong>${inputLocation}</strong></span>
      <input type="button" value="New Search" class="searchagain-button">`);
    getEventsByLocation(inputLocation, getDataOfEvents);
    handleNewSearchClick();

  })
}

function handleNewSearchClick(){
   console.log("Enter handleNewSearchClick ");
   $('.searchagain-button').on('click',function(event){
     event.preventDefault();
     $('.location-box').html("");
     $('.result-section').hide();
     $('.search-box').show();
     $('.user-location').val("");
     $('.events-list').html("");
   });
}

// Add marker to google map
function addMarkerToMap(eventData) {
  let eLat = eventData.latitude;
  let eLong = eventData.longitude;
  let venAddress = eventData.address||"No Address";
  let eName = eventData.name.text;
  let eventDetails = eventData.url;
  let eventDate = eventData.start.local;
  let formatter = Intl.DateTimeFormat("en-us", {
    weekday: 'short', 
    month: 'short', 
    day: '2-digit',
    hour: '2-digit', 
    minute: '2-digit'
  });
 
  let marker = new google.maps.Marker({
        position: {lat: Number(eLat), lng: Number(eLong)},
        map: map
  });

  google.maps.event.addListener(marker, 'click', function() {
  infowindow.setContent(`
    <div class="js-marker-window">
      <a href="${eventDetails}" target="_blank">${eName}</a>
      <p>${formatter.format(new Date(eventDate))}</p>
      <p>${venAddress}</p>
    </div>`);
    infowindow.open(map,marker);
  });
}



// Google Map
function initMap(lat, lng){
  $('.map').show();
  console.log("Init Map");
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
  $('#loading').hide();
  $('.result-section').hide();
  let input = $('#autocomplete').get(0);
  let autocomplete = new google.maps.places.Autocomplete(input);
}
$(init());