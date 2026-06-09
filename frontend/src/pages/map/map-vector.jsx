import React, { useEffect, useContext } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js';
import 'jsvectormap/dist/jsvectormap.min.css';
import { Link } from 'react-router-dom';
import { AppSettings } from './../../config/app-settings.js';

function MapVector() {
	const context = useContext(AppSettings);
	
	function renderMap() {
		var theme = (getComputedStyle(document.body).getPropertyValue('--bs-app-theme')).trim();
		var gray500 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
		var gray900 = (getComputedStyle(document.body).getPropertyValue('--bs-gray-900')).trim();
		var white = (getComputedStyle(document.body).getPropertyValue('--bs-white')).trim();
		var bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		const map = document.getElementById('jvectorMap');
		const mapElm = document.querySelectorAll('.jvm-tooltip');
		
		if (map) {
			for (let i = 0; i < mapElm.length; i++) {
				mapElm[i].remove();
			}
			map.innerHTML = '';
		
			var markers = [
				{ name: "Egypt", coords: [26.8206, 30.8025] },
				{ name: "Russia", coords: [61.524, 105.3188] },
				{ name: "Canada", coords: [56.1304, -106.3468] },
				{ name: "Greenland", coords: [71.7069, -42.6043] },
				{ name: "Brazil", coords: [-14.235, -51.9253] }
			];
			new jsVectorMap({
				selector: '#jvectorMap',
				map: 'world',
				zoomButtons: false,
				normalizeFunction: 'polynomial',
				hoverOpacity: 0.5,
				hoverColor: false,
				zoomOnScroll: false,
				series: {
					regions: [{
						normalizeFunction: 'polynomial'
					}]
				},
				labels: {
					markers: {
						render: (marker) => marker.name
					}
				},
				focusOn: {
					x: 0.5,
					y: 0.5,
					scale: 1
				},
				markers: markers,
				markerStyle: {
					initial: {
						fill: theme,
						stroke: 'none',
						r: 5,
					},
					hover: {
						fill: theme
					}
				},
				markerLabelStyle: {
					initial: {
						fontFamily: bodyFontFamily,
						fontSize: '12px',
						fill: white
					},
				},
				regionStyle: {
					initial: {
						fill: gray500,
						fillOpacity: 0.5,
						stroke: 'none',
						strokeWidth: 0.4,
						strokeOpacity: 1
					},
					hover: {
						fillOpacity: 0.5
					}
				},
				backgroundColor: gray900,
			});
		}
	}
	
	useEffect(() => {
    // eslint-diable-next-line
    renderMap();
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass('p-0 position-relative');
    
    return () => {
      context.handleSetAppContentFullHeight(false);
      context.handleSetAppContentClass('');
    };
		// eslint-disable-next-line
	}, []);

  return (
    <div className="h-100">
      <div className="position-absolute w-100 h-100 top-0 start-0 bottom-0 end-0">
        <div id="jvectorMap" className="w-100 h-100"></div>
      </div>

      <div className="app-content-padding position-relative">
        <ol className="breadcrumb float-xl-end">
          <li className="breadcrumb-item"><Link to="/map" className="text-white">Home</Link></li>
          <li className="breadcrumb-item active text-white">Vector Map</li>
        </ol>
        <h1 className="page-header text-white">Vector Map <small className="text-white text-opacity-75">header small text goes here...</small></h1>
      </div>
    </div>
  );
}

export default MapVector;