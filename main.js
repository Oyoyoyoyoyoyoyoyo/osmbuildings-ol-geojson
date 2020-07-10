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
const buildjson = require('./data/build1.json')
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
// map.on("click", mapClick);

const osmb = new OSMBuildings(map)
osmb.date(new Date(2017, 5, 15, 9, 30))
osmb.set(buildjson)

osmb.click(bindPopup);
function bindPopup(evt) {
  console.log('evt: ', evt);
}

function mapClick(event) {
  // get layer
  let osmbLayer;
  for (const key in map.getLayers().getArray()) {
    if (map.getLayers().getArray().hasOwnProperty(key)) {
      const layer = map.getLayers().getArray()[key]
      if (layer && layer instanceof OSMBuildings) {
        osmbLayer = layer
        console.log('osmbLayer: ', osmbLayer);
      }
    }
  }

  let layerArr = [];
  if (osmbLayer) {
    layerArr.push(osmbLayer);
  }
  getWmsFeatureInfo(layerArr, event);
}

/**
 * 获取WmsFeatureInfo
 */
function getWmsFeatureInfo(layerArr, event) {
  if (layerArr.length === 0) {
    return;
  }
  const mySector = layerArr[0];
  const view = event.map.getView();
  const resolution = view.getResolution();
  const source = mySector.getSource();
  const url = source.getFeatureInfoUrl(
    event.coordinate,
    resolution,
    view.getProjection(),
    {
      INFO_FORMAT: "application/json"
      // propertyName:'buildingid,value'
    }
  );
  if (url) {
    let format = new GeoJSON();
    const getWmsFeatues = axios({ url, method: "get" });
    getWmsFeatues.then(res => {
      console.log('res: ', res);
      if (res.data !== "" && res.data.features.length > 0) {
        // const featureTemp = res.data.features[0].properties;
        // const feature = new Feature(featureTemp);
        // const layerName = mySector.get("name");
        // if (layerName === "scenarioBuildingLayer") {
        //   const buildId = feature.get("buildingid");
        //   this.addBuildToSectroLineLayer(buildId);
        // }
        // if (layerName === "scenarioRoadLayer") {
        //   const roadId = feature.get("buildingid");
        //   this.addRoadToSectroLineLayer(roadId);
        // }
      } else {
        layerArr.shift();
        this.getWmsFeatureInfo(layerArr, event);
      }
    });
  }

}