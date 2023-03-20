const panorama = new PANOLENS.ImagePanorama( 'images/HMTpano_000001_000000.jpg' );
const panorama2 = new PANOLENS.ImagePanorama('images/HMTpano_000001_000000.jpg');
let imageContainer = document.querySelector('.image-container')

const viewer = new PANOLENS.Viewer({
    container: imageContainer,
});

viewer.add( panorama,panorama2 );


import Map from '../v7.3.0-site/en/latest/ol/Map.js';
import OSM from '../v7.3.0-site/en/latest/ol/source/OSM.js';
import TileLayer from '../v7.3.0-site/en/latest/ol/layer/Tile.js';
import View from '../v7.3.0-site/en/latest/ol/View.js';
import {transform} from '../v7.3.0-site/en/latest/ol/proj.js';

const points = [];
const features = [];
var imgs = []
var status;
function readTextFile1(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
               status = rawFile.responseText;
               
            }
        }
    }
    rawFile.send(null);
}
readTextFile1("../images/coordinates.txt");
let splitStatus=status.split('\n')

for(let i=1;i<splitStatus.length;i++){
  let line=splitStatus[i];
  let ele = line.split(' ')
  //console.log(Number(ele[2]))
  features.push(new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([
      //10.93376479,50.98380407
      Number(ele[2]),Number(ele[3])
    ])),
  }));
  //imgs.push(ele[0])
}
//console.log(imgs,points)
const getRandomNumber = function (min, ref) {
  console.log(typeof(Math.random() * ref + min))
  return Math.random() * ref + min;
}

for (var i = 1; i < 300; i++) {
  features.push(new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([
      getRandomNumber(50, 50), getRandomNumber(10, 50)
    ]))
  }));
}
console.log(points,features)
const vectorSource = new ol.source.Vector({
  features
});
const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: new ol.style.Style({
    image: new ol.style.Circle({
      radius: 2,
      fill: new ol.style.Fill({color: 'red'})
    })
  })
});


const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([10.93376479 , 50.98380407]),
    zoom: 16
  })
});

/*
map.on('click', (e)=>{
  var coord = e.coordinate;
  
  console.log(vectorSource.getFeaturesAtCoordinate(e.coordinate))
});*/