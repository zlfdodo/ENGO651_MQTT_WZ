// MQTT
var connected_flag = 0
var mqtt;
var reconnectTimeout = 2000;
var msg

function onConnectionLost() {
    console.log("connection lost");
    document.getElementById("status").innerHTML = "Connection Lost";
    document.getElementById("messages").innerHTML = "Connection Lost";
    connected_flag = 0;
}
function onFailure(message) {
    console.log("Failed");
    document.getElementById("messages").innerHTML = "Connection Failed- Retrying";
    setTimeout(MQTTconnect, reconnectTimeout);
}
function onMessageArrived(r_message) {
    out_msg = "Message received " + r_message.payloadString + "<br>";
    out_msg = out_msg + "Message received Topic " + r_message.destinationName;
    //console.log("Message received ",r_message.payloadString);
    console.log(out_msg);
    document.getElementById("messages").innerHTML = out_msg;
}
function onConnected(recon, url) {
    console.log(" in onConnected " + reconn);
}
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    document.getElementById("messages").innerHTML = "Connected to " + host + "on port " + port;
    connected_flag = 1
    document.getElementById("status").innerHTML = "Connected";
    console.log("on Connect " + connected_flag);
    //mqtt.subscribe("sensor1");
    //message = new Paho.MQTT.Message("Hello World");
    //message.destinationName = "sensor1";
    //mqtt.send(message);
}

function MQTTconnect() {
    document.getElementById("messages").innerHTML = "";
    // var s = document.forms["connform"]["server"].value;
    // var p = document.forms["connform"]["port"].value;
    var s = document.getElementById("server").value;
    var p = document.getElementById("port").value;
    if (p != "") {
        console.log("ports");
        port = parseInt(p);
        console.log("port" + port);
    }
    if (s != "") {
        host = s;
        console.log("host");
    }
    console.log("connecting to " + host + " " + port);
    var x = Math.floor(Math.random() * 10000);
    var cname = "orderform-" + x;
    mqtt = new Paho.MQTT.Client(host, port, cname);
    //document.write("connecting to "+ host);
    var options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure,

    };

    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    //mqtt.onConnected = onConnected;

    mqtt.connect(options);
    return false;
}

function MQTTdisconnect() {
    console.log("Disconnecting");
    mqtt.disconnect();
    document.getElementById("status").innerHTML = "Disconnected";
    document.getElementById("messages").innerHTML = "Disconnected";
    return false;
}


function sub_topics() {
    document.getElementById("messages").innerHTML = "";
    if (connected_flag == 0) {
        out_msg = "<b>Not Connected so can't subscribe</b>"
        console.log(out_msg);
        document.getElementById("messages").innerHTML = out_msg;
        return false;
    }
    // var stopic = document.forms["subs"]["Stopic"].value;
    var stopic = document.getElementById("Stopic").value;
    console.log("Subscribing to topic =" + stopic);
    mqtt.subscribe(stopic);
    return false;
}
function send_message() {
    document.getElementById("messages").innerHTML = "";
    if (connected_flag == 0) {
        out_msg = "<b>Not Connected so can't send</b>"
        console.log(out_msg);
        document.getElementById("messages").innerHTML = out_msg;
        return false;
    }
    // var msg = document.forms["smessage"]["message"].value;
    var msg = document.getElementById("message").value;
    console.log(msg);

    // var topic = document.forms["smessage"]["Ptopic"].value;
    var topic = document.getElementById("Ptopic").value;
    message = new Paho.MQTT.Message(msg);
    if (topic == "")
        message.destinationName = "test-topic"
    else
        message.destinationName = topic;
    mqtt.send(message);
    return false;
}

// Doc
document.addEventListener('DOMContentLoaded', function () {

    // Map
    // Calgary Map
    var map = L.map('map').setView([51.0443701, -114.0809625], 15);

    // Token
    var token = 'pk.eyJ1IjoiemxmZG9kbyIsImEiOiJja3o2Mjlmcnowc3h1Mm5wNGJ3M2ttdnlwIn0.XCp2ooN3S1XnA6scsq0DWA';

    // Mapbox
    var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/zlfdodo/cl0ucc07v006815ofbww3pk9n/tiles/{z}/{x}/{y}?access_token=' + token, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        tileSize: 512,
        zoomOffset: -1,
    }).addTo(map);
    // // Open Street
    // var basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    // }).addTo(map);

    // Geolocation
    function geoFindMe() {

        const status = document.querySelector('#status');
        const mapLink = document.querySelector('#map-link');

        mapLink.href = '';
        mapLink.textContent = '';

        function success(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // Set Temperature
            var temp = Math.random() * 100 - 40
            // Set Message
            var msg = "Latitude: " + latitude + "<br>" + " Longitude: " + longitude + "<br>" + " Temperature: " + temp;

            status.textContent = '';
            // mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            map.panTo(new L.LatLng(latitude, longitude));

            mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

            // Add color
            var color;
            if (temp >= -40 && temp < 10)
                color = new L.icon({
                    iconUrl: 'img/marker-icon-blue.png',
                    shadowUrl: 'img/marker-shadow.png'
                })
            else if (temp >= 10 && temp < 30)
                color = new L.icon({
                    iconUrl: 'img/marker-icon-green.png',
                    shadowUrl: 'img/marker-shadow.png'
                })
            else if (temp >= 30 && temp <= 60)
                color = new L.icon({
                    iconUrl: 'img/marker-icon-red.png',
                    shadowUrl: 'img/marker-shadow.png'
                })

            // Add marker
            var marker = L.marker([latitude, longitude], { icon: color })
                .addTo(map)

            // Add marker popup
            marker.bindPopup(msg).openPopup();



            // var topic = document.forms["smessage"]["Ptopic"].value;
            var topic = document.getElementById("Stopic").value;
            message = new Paho.MQTT.Message(msg);
            if (topic == "")
                message.destinationName = "test-topic"
            else
                message.destinationName = topic;
            mqtt.send(message);
            return false;


        }

        function error() {
            status.textContent = 'Unable to retrieve your location';
        }

        if (!navigator.geolocation) {
            status.textContent = 'Geolocation is not supported by your browser';
        } else {
            status.textContent = 'Locating…';
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }

    var geofindme = document.querySelector('#find-me').addEventListener('click', geoFindMe);

});