const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";

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

function getEventsByLocation(location, callback){
  const params= {
    "location.address": `${location}`,
    token: API_KEY
  }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,callback);

}

function collectEventInfo(result) {
  console.log("Enter collectEventInfo")
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
  eventData = {
    "eventName": result.name.text,
    "eventDetailsUrl": result.url,
    "eventLogo":  result.logo.original.url,
    "venueId": result.venue_id
  }
  eventsArray.push(eventData);
  console.log(`Putting ${venueId} at index ${eventData.length - 1}`);
  getEventVenueDetails(venueId,logData);

  // $('.events-list').append(`
  //   <div class="js-eventInfo">
  //     <img class="event-image" src="${eventLogo}">
  //     <h5 class="event-name">${eventName}</h5>
  //     <a href="${eventDetailsUrl}" class="event-details">More Details</a> 
  //   </div>`)
}

function renderEventInfo(resultInfo){
  console.log("Enter renderEventInfo");
  console.log(resultInfo);
  $('.events-list').append(`
    <div class="js-eventInfo">
      <img class="event-image" src="${resultInfo.eventLogo}">
      <h5 class="event-name">${resultInfo.eventName}</h5>
      <a href="${resultInfo.eventDetailsUrl}" class="event-details">More Details</a> 
    </div>`)
}
// Displays the details of the events retrieved
function displayEvents(data) {
  console.log("Enter callback for eventdetails (displayEvents)");

  const results = data.events.map((item, index) => collectEventInfo(item));
  $('.search-box').hide();
}

// Get the venue details of each event retrieved
function getEventVenueDetails(id, callback){
 console.log(" Enter getEventVenueDetails Venue Id: " + id);
  const params= {
    token: API_KEY
  }
   $.getJSON(`${EVENTBRITE_URL}/venues/${id}/`, params, callback);
}

let index = 0;
function logData(data){
  console.log("Enter callback for venue details (LogData)");
  //eventData.address = data.address.localized_address_display;
  //console.log("Address:" + eventData.address);
   
   eventsArray[index].address = data.address.localized_address_display;
   console.log(eventsArray[index].address);
   console.log(`Putting ${venueId} at index ${eventData.length - 1}`);
  // eventsArray.forEach((item,index) => console.log(item));
  renderEventInfo(eventsArray[index]);
   index++;
}

// Function called when user enters the location and press search button
function handleSearchClick() {
  console.log("Enter handleSearchClick ");
  $('.search-button').on('click', function (event){
    event.preventDefault();
    let location = $('.user-location').val();
    //console.log("Location: "+ location);
    getEventsByLocation(location,displayEvents);
   })
 
}

// Google Map
function initMap(){
  console.log("Init Map");
  let options = {
    zoom: 8,
    center: {lat: 37.7749, lng: -122.4194}
  }
  // let map = new google.maps.Map(document.getElementById('map'),options);
}


function init(){
  handleSearchClick();
  $('.events-list').hide();
  $('.result-section').hide();
}
$(init());