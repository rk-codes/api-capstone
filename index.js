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
  let eventName = result.name.text;
  let eventDescription = result.description.text;
  let eventDetailsUrl = result.url;
  let eventLogo = result.logo.original;
  console.log(`Name: ${eventName} Description: ${eventDescription} Details: ${eventDetailsUrl}`);
  $('.events-list').append(`
    <div>
      <h5 class="event-name">${eventName}</h5>
      <img class="event-image" src="${eventLogo}">
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

function init(){
  handleSearchClick();
}
$(init());