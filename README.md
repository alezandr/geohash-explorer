# geohash-explorer

[Geohash-explorer](https://geohash.softeng.co/) is a webapp which displays a world map and the interactive grid, that grid allows to enter a geohash. Geohash is a base32 string, where each character points a particular section of the map, each next character to subsection and etcetera. Longer geohash - more precise geolocation.

This app could handle a geohash passed through the URL, in that case the appropriate section of the map will be highlighted and zoomed in. Example: 

Singapore - [w21z](https://geohash.softeng.co/w21z)  
Gibraltar - [eykh](https://geohash.softeng.co/eykh)  
Cape Horn - [4w01s8zp](https://geohash.softeng.co/4w01s8zp)  


How to build and run webapp
-
```Bash
npm install
npm run start
```
