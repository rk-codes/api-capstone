const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";
const MAP_ICON_DEFAULT = "marker_initial.png"
const MAP_ICON_SELECTED = "marker_new.png"
const MAP_URL = "https://maps.googleapis.com/maps/api/geocode"
let map;
let mapInfoWindow;
let inputLocation;
let allMarkers = [];

// Calls the api to retrieve events in the location submitted by the user
function getEventsByLocation(location, callback){
  const params= {
    "location.address": `${location}`,
    token: API_KEY
  }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`, params, callback);
}

// This function is the callback of retrieving the events. 
// The data recieved is passed to next ajax request to collect venue details
function handleEventData(data) {
  $('#loading').hide();
  $('.result-section').show();
  initializeMap(inputLocation);
  data.events.forEach((event) => {
    getEventVenueDetails(event);
  });
}

// Calls google map api and centers the map on user input location
function initializeMap(location) {
  let options = {
    zoom: 10,
  }
  map = new google.maps.Map($('#map').get(0), options);
  mapInfoWindow = new google.maps.InfoWindow({});
  $.getJSON(`${MAP_URL}/json?address=${location}`, function (data) {
    let latitude = data.results[0].geometry.location.lat;
    let longitude = data.results[0].geometry.location.lng;
    map.setCenter(new google.maps.LatLng(latitude, longitude));      
    $('#map').show();
  });
}

// This function makes an ajax request to get the venue information of an event
function getEventVenueDetails(eventData){  
  const params= {
    token: API_KEY
  }
  let id = eventData.venue_id;
  $.getJSON(`${EVENTBRITE_URL}/venues/${id}/`, params, function(data){
    eventData.address = data.address.localized_address_display;
    eventData.latitude = data.latitude;
    eventData.longitude = data.longitude;
    renderEventInfo(eventData); 
    addMarkerToMap(eventData);
  });
}

// This function populates the DOM with the event data
function renderEventInfo(eventResult) {
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
    <div class="js-eventInfo" data-name="${eventName}">
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
    </div>
  `);
}

// This function listens to the submission of a search location by the user
function handleSearchClick() {
  $('.search-form').submit(function (event) {
    event.preventDefault();
    inputLocation = $('.user-location').val();
    $('.search-box').hide();
    $('.intro-section').hide();
    $('#loading').show();
    $('.location-box').show();
    $('.location-box').append(`
      <span class="current-location">Upcoming events in <strong>${inputLocation}</strong></span>
      <input type="button" value="New Search" class="js-searchagain-button">`);
    getEventsByLocation(inputLocation, handleEventData);
    handleNewSearchClick();
  });
}

// Handles user giving a new search
function handleNewSearchClick() {
  $('.js-searchagain-button').on('click', function(event) {
    event.preventDefault();
    $('.location-box').html("");
    $('.result-section').hide();
    $('.intro-section').show();
    $('.search-box').show();
    $('.user-location').val("");
    $('.events-list').html("");
    allMarkers.length = 0;
  });
}

// Add marker to google map and set the content of the info window
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
    position: new google.maps.LatLng(Number(eLat), Number(eLong)),
    map: map,
    name: eName
  });
  marker.setIcon(MAP_ICON_DEFAULT);
  google.maps.event.addListener(marker, 'click', function() {
  mapInfoWindow.setContent(`
    <div class="js-marker-window">
      <a href="${eventDetails}" target="_blank">${eName}</a>
      <p class="js-marker-date">${formatter.format(new Date(eventDate))}</p>
      <p>${venAddress}</p>
    </div>`);
    mapInfoWindow.open(map,marker);
  });
  allMarkers.push(marker); 
}

// Sets a new marker for an event when mouse moved over that event in the list
function handleMouseOverEventInList(){
  $('.events-list').on('mouseover', '.js-eventInfo',function(event) {
    let name = event.currentTarget.getAttribute("data-name");
    for(let i = 0; i < allMarkers.length; i++) {
      if(name === allMarkers[i].name) {
        allMarkers[i].setIcon(MAP_ICON_SELECTED);
        break;
      }
    }
  });
}

// Sets the marker to the initial icon when mouse moved out of the event in the list
function handleMouseOutEventInList(name){
  $('.events-list').on('mouseout', '.js-eventInfo',function(event) {
    let name = event.currentTarget.getAttribute("data-name");
    for(let i = 0; i < allMarkers.length; i++) {
      if(name === allMarkers[i].name) {
        allMarkers[i].setIcon(MAP_ICON_DEFAULT);
        break;
      }
    }
  });
}

// Initial settings
function init() {
  handleSearchClick();
  handleMouseOverEventInList();
  handleMouseOutEventInList();
  $('#loading').hide();
  $('.result-section').hide();
  let input = $('#autocomplete').get(0);
  let autocomplete = new google.maps.places.Autocomplete(input);
}
$(init());