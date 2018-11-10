import React, {Component} from 'react';
import LocationList from './LocationList';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "Cafe Creme",
                    'type': "56 Front St, Bath, ME 04530",
                    'latitude': 43.912610,
                    'longitude': -69.814188,
                    'streetAddress': "56 Front St, Bath, ME 04530"
                },
                {
                    'name': "J R Maxwell & Co.",
                    'type': "122 Front St, Bath, ME 04530",
                    'latitude': 43.913840,
                    'longitude': -69.814290,
                    'streetAddress': "122 Front St, Bath, ME 04530"
                },
                {
                    'name': "Mateo's Hacienda",
                    'type': "56 Centre St, Bath, ME 04530",
                    'latitude': 43.912444,
                    'longitude': -69.8157,
                    'streetAddress': "56 Centre St, Bath, ME 04530"
                },
                {
                    'name': "Starlight Cafe",
                    'type': "15 Lambard St, Bath, ME 04530",
                    'latitude': 43.912542,
                    'longitude': -69.813324,
                    'streetAddress': "15 Lambard St, Bath, ME 04530"
                },
                {
                    'name': "Library Park",
                    'type': "890 Washington St, Bath, ME 04530",
                    'latitude': 43.915684,
                    'longitude': -69.815392,
                    'streetAddress': "890 Washington St, Bath, ME 04530"
                },
                {
                    'name': "Frosty's Donuts",
                    'type': "770 Washington St, Bath, ME 04530",
                    'latitude': 43.9120981,
                    'longitude': -69.816503,
                    'streetAddress': "770 Washington St, Bath, ME 04530"
                },
                {
                    'name': "Chocolate Church Arts Center",
                    'type': "804 Washington St, Bath, ME 04530",
                    'latitude': 43.912917,
                    'longitude': -69.816942,
                    'streetAddress': "804 Washington St, Bath, ME 04530"
                },
                {
                    'name': "Beale Street Barbeque",
                    'type': "215 Water St, Bath, ME 04530",
                    'latitude': 43.91,
                    'longitude': -69815226,
                    'streetAddress': "215 Water St, Bath, ME 04530"
                },
                {
                    'name': "Benjamin F. Packard House Bed & Breakfast",
                    'type': "45 Pearl St, Bath, ME 04530",
                    'latitude': 43.921232,
                    'longitude': -69.815379,
                    'streetAddress': "45 Pearl St, Bath, ME 04530"
                },
                 {
                    'name': "Mae's Cafe & Bakery",
                    'type': "160 Centre St, Bath, ME 04530",
                    'latitude': 43.911322,
                    'longitude': -69.819609,
                    'streetAddress': "160 Centre St, Bath, ME 04530"
                },
                {
                    'name': "The Inn At Bath",
                    'type': "969 Washington St, Bath, ME 04530",
                    'latitude': 43.918570,
                    'longitude': -69.815011,
                    'streetAddress': "185 Greenwich St, New York, NY 10006"
                },
                {
                    'name': "The Cabin",
                    'type': "552 Washington St, Bath, ME 04530",
                    'latitude': 43.904719,
                    'longitude': -69.816008,
                    'streetAddress': "552 Washington St, Bath, ME 04530"
                },
                {
                    'name': "Bath Skate Park Center",
                    'type': "4 Old Brunswick Rd, Bath, ME 04530",
                    'latitude': 43.918291,
                    'longitude': -69.827562,
                    'streetAddress': "4 Old Brunswick Rd, Bath, ME 04530"
                },
                {
                    'name': "Thorne Head Preserve Trail Head",
                    'type': "Whiskeag Trail, Bath, ME 04530",
                    'latitude': 43.943161,
                    'longitude': -69.818435,
                    'streetAddress': "Whiskeag Trail, Bath, ME 04530"
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };
        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyB8i5Hjadmbk0LX4KsrN67ftqngalc48XU&callback=initMap')
    }


    initMap() {
        var self = this;

        var mapview = document.getElementById('map');
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 43.912949, lng: -69.813771},
            zoom: 18,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' - ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }


    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading Data...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }


    getMarkerInfo(marker) {
        var self = this;
        var clientId = "K154A23TLZK5ZFVP3WSTUMHJHTA2ZP2JRTVLAUTAZBZATVD2";
        var clientSecret = "SK2RPIYIF1FZZEQH0P5ZTEB0ZT4IGFKG4EFOKNVXQW5OSVNN";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }

                    response.json().then(function (data) {
                        var location_data = data.response.venues[0];
                        var verified = '<b>Verified Location: </b>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        var checkinsCount = '<b>Number of CheckIn: </b>' + location_data.stats.checkinsCount + '<br>';
                        var usersCount = '<b>Number of Users: </b>' + location_data.stats.usersCount + '<br>';
                        var tipCount = '<b>Number of Tips: </b>' + location_data.stats.tipCount + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">More on Foursquare Website</a>'
                        self.state.infowindow.setContent(checkinsCount + usersCount + tipCount + verified + readMore);
                    });
                }
            )
            .catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }


    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;


function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Google Maps can't be loaded");
    };
    ref.parentNode.insertBefore(script, ref);
}

