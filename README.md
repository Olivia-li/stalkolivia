# Marathon Tracker

Marathon Tracker is a project that facilitates real-time tracking of a runner's position during the TCS New York City Marathon 2023 using Apple's AirTag technology. The project is divided into two main components: a server-side component that examines cache files from the Find My app to obtain AirTag location data, and a client-side application that presents the marathon route along with the runner's current location on a map.

## Features

- Real-time runner's position tracking utilizing Apple AirTag.
- Visualization of the marathon route alongside the runner's current location on a map.
- Provision for friends and family to track the runner's progress during the marathon.

## Components

### Server-side Component

The server-side component delves into the cache data of the Find My app to extract the location data of a specified AirTag. It then sets up a Flask server to serve the location data to the client app.

#### Implementation Details

- Analyzes cache files to extract AirTag location data.
- Establishes a Flask server to relay location data to the client app.

### Client-side Application

The client-side application maps out the marathon route by downloading the geojson file of the TCS NYC 2023 marathon route from Strava. It fetches data from the server to display the runner's current location on the map.

#### Implementation Details

- Downloads geojson of the marathon route from Strava.
- Communicates with the server to obtain the runner's location data.
- Displays the marathon route and the runner's current location on a map.

## Disclaimer

This project is not affiliated with, endorsed by, or supported by Apple Inc., Strava, or the organizers of the TCS New York City Marathon. The use of Apple's Find My network and AirTags for tracking purposes may be subject to Apple's terms of service and privacy policy. Utilize this software at your own risk.