import 'ol/ol.css';
import {
  Map,
  View
} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {
  transform
} from 'ol/proj';
import OSMBuildings from './OSMBuildings/OSMBuildings-OL5'
import axios from "axios";
const buildjson = require('./data/build.json')
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: transform([116.4296391258555, 39.9385470505290], 'EPSG:4326', 'EPSG:3857'),
    zoom: 16
  })
});

const osmb = new OSMBuildings(map)
osmb.date(new Date(2017, 5, 15, 9, 30))
osmb.set(buildjson)
osmb.click(bindPopup);
function bindPopup(evt) {
  console.log('evt: ', evt);
}
