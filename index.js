
//const API_KEY = "T4JBQAXRHAC2IEPLR3DX";
const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";

function getCategoriesFromApi(endpoint, callback) {
  console.log("Enter")
  const settings = {
    url: `${EVENTBRITE_URL}/${endpoint}/`,
    crossDomain: true,
    data: {
      token: API_KEY
    },
    dataType: 'json',
    type: 'GET',
    success: callback,
    failure: logData
  };

  $.ajax(settings);
}

function logData(data){
  console.log(data);
}
//getCategoriesFromApi("categories",logData);

function getEventsByLocation(location, callback){
  const params= {
    "location.address": `${location}`,
    token: API_KEY
  }
  $.getJSON(`${EVENTBRITE_URL}/events/search/`,params,logData);

}
let user_location="California";
getEventsByLocation(user_location,logData);