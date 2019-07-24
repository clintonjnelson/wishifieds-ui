Info on Leaflet

- leaflet.js is the minified js
- leaflet.css is the styles
- images/ is the folder of support images
- leaflet.js.map is the file to un-uglify your code for debugging

Leaflet will put its own global variable "L" into the app.
This can be referenced by accessed via adding "declare let L;" in the angular code with the other imports, and then using the "L" as needed afterward.

Example:
declare let L;
const map = L.map('map').setView([51.505, -0.09], 13);

