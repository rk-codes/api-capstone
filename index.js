const API_KEY = "GBPFA2VAYOHE3CTNFMBA";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";
const MAP_ICON_DEFAULT = "marker_initial.png";
const MAP_ICON_SELECTED = "marker_new.png";
const MAP_URL = "https://maps.googleapis.com/maps/api/geocode";
const BING_MAP_URL = "https://dev.virtualearth.net/REST/v1/Locations/";
const BING_KEY = "ApGN-XyZpFjvcsLtW-_RttRXlVe9-3wHd3AoRTMpuCvpJk22JpdVD0iU1aP_IQRU";
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
  findLatLngViaBingMap(location);  
}

// Center and display the map using the latitude and longitude received
function centerAndDisplayMap(latitude, longitude) {
  map.setCenter(new google.maps.LatLng(latitude, longitude));      
  $('#map').show();
}

//Get the values of latitude and longitude from google map geocoder if  
// getting latitude and longitude from bing api fails
function findLatLngViaGoogleMaps(location) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': `${location}` }, function (results, status) { 
      if(results[0]) {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        centerAndDisplayMap(lat, lng);
      }  
      else {
      $('.map-box').html(`
        <div class="map-error">
          <p>We're having trouble zooing in to the results. Please zoom manually.
          </p>
          <p>Sorry about that</p>
          <button type="button" class="maperror-button">Ok</button>
        </div>
      `)
   }       
  })
}

//Get the values of latitude and longitude based on the user input location
function findLatLngViaBingMap(location) {
  $.getJSON(`${BING_MAP_URL}/?q=${location}&key=${BING_KEY}`, function (data) {
    if(data.resourceSets[0]) {
      let latitude = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0];
      let longitude = data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1];
      centerAndDisplayMap(latitude,longitude);
    }
    else {
     findLatLngViaGoogleMaps(location);
   }
  });  
}

//Default display of map if getting latitude and longitude from bing or google geocoder fails
function mapDefaultDisplay() {
   map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 1
  });
  $('#map').show();
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

// Handles user clicking ok button on map loading error
function handleMapErrorButtonClick() {
  $('main').on('click', '.maperror-button', function(event) {
    console.log("Clicked")
    $('.map-error').hide();
    mapDefaultDisplay();
  })
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
  handleMapErrorButtonClick();
  $('#loading').hide();
  $('.result-section').hide();
  let input = $('#autocomplete').get(0);
  let autocomplete = new google.maps.places.Autocomplete(input);
}
$(init());