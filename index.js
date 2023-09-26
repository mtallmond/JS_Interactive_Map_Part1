//add a select/search interface for the user with values: coffee, restaurant, hotel, and market
//add markers for local businesses
//customize marker styles by business type

function addMarkers() {
    for (var i = 0; i < this.businesses.length; i++) {
    this.markers = L.marker([
        this.businesses[i].lat,
        this.businesses[i].long,
    ])
        .bindPopup(`<p1>${this.businesses[i].name}</p1>`)
        .addTo(this.map)
    }}

// let dd = document.querySelector("#businesses")
// dd.addEventListener('change',function(e){
// //what is value of this element
// alert(e.target.value)
// })

// async function main(){
//     let userCoord = await getCoords()
// }

async function getCoords(){
    const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    });
    return [pos.coords.latitude, pos.coords.longitude]
}

async function getFoursquare(coordinates, business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3eFOiM0WOOz/ZqRDOsm0eaVYH/OaiMShN5jy6cTDldCA='
		}
	}
	let limit = 5
	let lat = coordinates[0]
	let lon = coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}

// process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

async function getCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

async function main(){
    let coordinates = await getCoords()
    var map = L.map('map').setView([35.61227, -80.83745], 15);
    //added const from solution
    const myMap = {
        coordinates: [],
        businesses: [],
        map: {},
        markers: {},
    }
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    
    var marker = L.marker([35.61227, -80.83745]).addTo(map);
    marker.bindPopup("<b>Hello Bootcamp Classmates!</b><br>You are here.").openPopup();    
    //submit button
    document.getElementById('submit').addEventListener('click', async (event) => {
        event.preventDefault()
        let business = document.getElementById('business').value
        console.log(business)
        let data = await getFoursquare(coordinates, business)
        console.log(data)
        myMap.businesses = processBusinesses(data)
        myMap.addMarkers()
    })
}

//eventListener
window.onload = async () => {
    main()
}

