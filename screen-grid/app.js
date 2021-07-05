import React from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';
import {HeatmapLayer,} from '@deck.gl/aggregation-layers';
import {JSONLoader} from '@loaders.gl/json'
import {CSVLoader} from '@loaders.gl/csv';

// const DATA_URL =
//   'https://raw.githubusercontent.com/rustyb/test-repo/main/heatmap.json'; // eslint-disable-line
const DATA_URL = 
  'https://serene-lumiere-e9fb63.netlify.app/heatmap-user.csv';

const INITIAL_VIEW_STATE = {
  longitude: -8.08,
  latitude: 52.90,
  zoom: 6,
  maxZoom: 16,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

function HSLToRGB(h,s,l) {
  // Must be fractions of 1
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;  
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return [r,g,b]
}

function stringToRGBColor(str, s, l) {
  // console.log('getting colour for', str, s, l)
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return HSLToRGB(h,s,l)
  // return 'hsl('+h+', '+s+'%, '+l+'%)';
}

function getTooltip({object}) {
  return (
    object &&
    `\
  ${object.username || 'n/a'}`
  );
}

export default function App({
  data = DATA_URL,
  intensity = 1,
  threshold = 0.03,
  radiusPixels = 30,
  mapStyle = MAP_STYLE
}) {
  const layers = [
    new HeatmapLayer({
      data,
      loaders: [CSVLoader],
      loadOptions: {
        // json: {
        //   table: false
        // }
      },
      id: 'heatmp-layer',
      pickable: false,
      // getPosition: d => [d[0], d[1]],
      getPosition: d => [d.lat, d.lon],
      // getWeight: d => d[2],
      getWeight: d => d.weight,
      radiusPixels,
      intensity,
      threshold
    }),
    new ScatterplotLayer({
      id: 'scatter-plot',
      data,
      loaders: [CSVLoader],
      radiusScale: radiusPixels,
      radiusMinPixels: 0.25,
      // getPosition: d => [d[0], d[1], 0],
      getPosition: d => [d.lat, d.lon, 0],
      getFillColor: d => d.username ? stringToRGBColor(d.username, 90, 80) : stringToRGBColor('nobody', 90, 80),
      getRadius: 1,
      // updateTriggers: {
      //   getFillColor: [maleColor, femaleColor]
      // }
      pickable: true
    })
    
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers} getTooltip={getTooltip}>
      <StaticMap reuseMaps mapStyle={mapStyle} preventStyleDiffing={true} />
    </DeckGL>
  );
}

export function renderToDOM(container) {
  render(<App />, container);
}