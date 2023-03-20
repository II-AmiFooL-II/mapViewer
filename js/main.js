//Create Panolens
const panorama = new PANOLENS.ImagePanorama( 'images/HMTpano_000001_000000.jpg' );
let imageContainer = document.querySelector('.image-container')
const viewer = new PANOLENS.Viewer({
    container: imageContainer,
});

viewer.add( panorama );

//listing all avilable images so i can display only those 
const present_imgs = new Set(['HMTpano_000001_000000.jpg','HMTpano_000001_000001.jpg','HMTpano_000001_000002.jpg','HMTpano_000001_000003.jpg','HMTpano_000001_000004.jpg','HMTpano_000001_000005.jpg','HMTpano_000001_000006.jpg','HMTpano_000001_000007.jpg','HMTpano_000001_000008.jpg','HMTpano_000001_000009.jpg'])

//Change Pano Image on click
function changePanoImg(img){
  if (present_imgs.has(img)){
    viewer.dispose();
    img =  "images/"+img
    const panorama = new PANOLENS.ImagePanorama(img);
    viewer.add( panorama );
  }
  else{
    alert("no image provided for this co-ordinate")
  }
}

const features = [];
var imgs = {};
var status;

//Read the co-ordinates.txt file to extract imgs and coordinates
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
readTextFile1("./js/coordinates.txt");

//Save the coordinates in the text file
let splitStatus=status.split('\n')
for(let i=1;i<splitStatus.length;i++){
  let line=splitStatus[i];
  let ele = line.split(' ')
  features.push(new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([
      //10.93376479,50.98380407
      Number(ele[2]),Number(ele[3])
    ])),
  }));
  imgs[[Number(ele[2]).toFixed(5),Number(ele[3]).toFixed(5)]] = ele[0].slice(3,-1)
}
//console.log(imgs)


const vectorSource = new ol.source.Vector({
  features
});

//styles of points
const highlightStyle = new  ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({color: '#0099ff'}),
    stroke: new ol.style.Stroke({color: 'white', width: 2})
  })
})

//styles of points
const normalStyle = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 5,
    fill: new ol.style.Fill({color: 'red'}),
    stroke: new ol.style.Stroke({color: '#bada55', width: 2})
  })
});


const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: normalStyle
});

//Display Map
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([10.93376479, 50.98374614]),
    zoom: 18
  }),

});


//Handle click on openlayer map points
var prevFeature = new ol.Feature();
map.on('click',function(event){
  var feature = map.forEachFeatureAtPixel(event.pixel,
    function (feature) {
        return feature;
    });
  
  if (feature !=null){
    console.log(feature)
    feature.setStyle(highlightStyle);
    prevFeature.setStyle(normalStyle)
    prevFeature = feature 
    //vectorLayer.redraw();
    //feature.set('style',customStyle)
    console.log("other")
    console.log(feature)
    var cords = displaySnap(event.coordinate)
    if ([cords[0].toFixed(5),cords[1].toFixed(5)] in imgs){
      changePanoImg(imgs[[cords[0].toFixed(5),cords[1].toFixed(5)]])
    }
  }
});

let point = null;
const displaySnap = function (coordinate) {
  const closestFeature = vectorSource.getClosestFeatureToCoordinate(coordinate);
  if (closestFeature === null) {
    point = null;
  } else {
    const geometry = closestFeature.getGeometry();
    const closestPoint = geometry.getClosestPoint(coordinate);
    if (point === null) {
      point = new ol.geom.Point(closestPoint);
    } else {
      point.setCoordinates(closestPoint);
    }
  }
  return ol.proj.transform(point.getCoordinates(), 'EPSG:3857', 'EPSG:4326')
};
