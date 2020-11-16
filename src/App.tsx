import React, { useCallback, useEffect, useRef } from 'react';
import './App.css';
import { Activity } from '../../strava-viewer/src/types/activity';

function App() {
  const map = useRef<google.maps.Map>()

  useEffect(() => {
    map.current = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: 30, lng: -100 },
      zoom: 15
    });
  }, []);

  const loadData = useCallback((activityId) => {
    fetch(`http://localhost:8080/activity/${activityId}`)
      .then((res) => res.json())
      .then((activityData: Activity) => {

        if (!map.current) {
          return;
        }

        const positionalTracks = activityData.track.filter(({ position }) => !!position)

        const path = positionalTracks.map(({ position }) => position!);

        const routePolyLine = new google.maps.Polyline({
          path,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 3,
        });

        routePolyLine.setMap(map.current);

        const firstTrackWithLocation = activityData.track.find(({ position }) => !!position);

        firstTrackWithLocation && map.current && map.current.panTo(firstTrackWithLocation.position!);



      })
  }, [])

  return (
    <div>
      <div className="map-container">
        <div id="map" style={{ height: '100%' }}>
        </div>
      </div>
      <button onClick={() => loadData('test')}>Load Data</button>
    </div>
  );
}

export default App;
