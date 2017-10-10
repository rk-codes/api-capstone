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


// Calls the api to get the events in the given location
function getEventsByLocation(location, callback){
  const params= {
    "location.address": `${location}`,
    token: API_KEY
  }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,callback);

}

// Success callback. Get the details of the events retrieved
function getDataOfEvents(data) {
  console.log("Enter callback for eventdetails (getDataOfEvents)");

  const results = data.events.map((item, index) => collectEventInfo(item));
  $('.search-box').hide();
}

// Collect the event information and store the details in an eventData object
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
  //console.log(`Putting ${venueId} at index ${eventData.length - 1}`);
  getEventVenueDetails(venueId,collectVenueInfo);

  // $('.events-list').append(`
  //   <div class="js-eventInfo">
  //     <img class="event-image" src="${eventLogo}">
  //     <h5 class="event-name">${eventName}</h5>
  //     <a href="${eventDetailsUrl}" class="event-details">More Details</a> 
  //   </div>`)
}



// Call the api to get the venue details of each event retrieved using the venue Id
function getEventVenueDetails(id, callback){
 console.log(" Enter getEventVenueDetails Venue Id: " + id);
  const params= {
    token: API_KEY
  }
   $.getJSON(`${EVENTBRITE_URL}/venues/${id}/`, params, callback);
}


// Success callback
let index = 0;
function collectVenueInfo(data){
  console.log("Enter callback for venue details (collectVenueInfo)");
   eventsArray[index].address = data.address.localized_address_display;
   console.log(eventsArray[index].address);
    // eventsArray.forEach((item,index) => console.log(item));
  renderEventInfo(eventsArray[index]);
   index++;
}


// Add the event details to the DOM
function renderEventInfo(resultInfo){
  console.log("Enter renderEventInfo");
  console.log(resultInfo);
  $('.events-list').append(`
    <div class="js-eventInfo">
      <img class="event-image" src="${resultInfo.eventLogo}">
      <h5 class="event-name">${resultInfo.eventName}</h5>
      <span>${resultInfo.address}</span>
      <a href="${resultInfo.eventDetailsUrl}" class="event-details">More..</a> 
    </div>`)
}


// Function called when user enters the location and press search button
function handleSearchClick() {
  console.log("Enter handleSearchClick ");
  $('.search-button').on('click', function (event){
    event.preventDefault();
    let location = $('.user-location').val();
    //console.log("Location: "+ location);
    getEventsByLocation(location,getDataOfEvents);
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