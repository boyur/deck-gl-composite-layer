import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer, ArcLayer } from '@deck.gl/layers';

import './App.css';

const style = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '100%'
};

const data = [
  {
    "inbound": 72633,
    "outbound": 74735,
    "from": {
      "name": "19th St. Oakland (19TH)",
      "coordinates": [
        -122.269029,
        37.80787
      ]
    },
    "to": {
      "name": "12th St. Oakland City Center (12TH)",
      "coordinates": [
        -122.271604,
        38.103664
      ]
    }
  }
];

class MyCompositeLayer extends CompositeLayer {
  renderLayers() {
    const {
      id, data, showPoints, pointRadius,
      pointColor, type, ...arcProps
    } = this.props;

    return [
      showPoints && new ScatterplotLayer({
        id: 'scatterplot-layer-from',
        data,
        getRadius: pointRadius,
        getFillColor: pointColor,
        getPosition: d => d.from.coordinates,
      }),
      showPoints && new ScatterplotLayer({
        id: 'scatterplot-layer-to',
        data,
        filled: true,
        getRadius: pointRadius,
        getFillColor: pointColor,
        getPosition: d => d.to.coordinates,
      }),
      new ArcLayer({
        id: 'arc-layer',
        data,
        ...arcProps
      })
    ];
  }
}

MyCompositeLayer.layerName = 'MyCompositeLayer';

const layer = new MapboxLayer({
  id: 'MyCompositeLayer',
  type: MyCompositeLayer,
  data,
  pointRadius: 3000,
  pointColor: [255, 140, 0],
  getSourcePosition: d => {
    console.log(d);
    return d.from.coordinates
  },
  getTargetPosition: d => d.to.coordinates,
  getSourceColor: [255, 73, 124],
  getTargetColor: [0, 136, 255],
  getStrokeWidth: 5,
  showPoints: true
});

mapboxgl.accessToken = 'pk.eyJ1IjoiYm95dXJhcnRlbSIsImEiOiJjajBkeWY4ZmwwMDEyMzJseG8wZDI4YW5pIn0.DBEWyIXo3VknCRDcqa7Msg';

class App extends Component {
  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-122.269029, 37.80787],
      zoom: 9
    });

    this.map.on('load', () => {
      this.map.addLayer(layer);
    });
  }

  render() {
    return (
      <div id='map' style={style} />
    );
  }
}

export default App;
