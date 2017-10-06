
//const API_KEY = "T4JBQAXRHAC2IEPLR3DX";
const API_KEY = "H5GX62DOZ35YWUCY36J7";
const EVENTBRITE_URL = "https://www.eventbriteapi.com/v3";

function getDataFromApi(endpoint, callback) {
  console.log("Enter")
  const settings = {
    url: `${EVENTBRITE_URL}/${endpoint}`,
    crossDomain: true,
    data: {
      token: API_KEY
    },
   // dataType: 'jsonp',
    type: 'GET',
    success: callback,
    failure: logData
  };

  $.ajax(settings);
}

function logData(data){
  console.log(data);
}
getDataFromApi("categories",logData);

