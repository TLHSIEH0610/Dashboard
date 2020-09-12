import React, { Fragment, useEffect, useState  } from 'react'
import axios from 'axios'
import styles from './Map.module.scss'
import GoogleMapReact  from 'google-map-react';
import MarkerClusterer from '@google/markerclusterer'


const Map = () => {
    let center = {
        lat: 24.77393981790647,
        lng: 121.0090720653534
      }  
    let zoom = 8
    // let location
    const [locations, setLocation] = useState(null)

    useEffect(()=>{
        axios.get('/api/location.json').then((res) => {
            // locations = res.data
            setLocation(res.data)
        })
        const script = document.createElement('script')
        script.src = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js'
        script.async = true
        document.body.appendChild(script)
    },[])

    const setGoogleMapRef = (map, maps) => {
    //    const googleMapRef = map
       const googleRef = maps
        let markers = locations && locations.map((location) => {
          return new googleRef.Marker({position: location, label:'test'})
        })
        // let markerCluster = new MarkerClusterer(map, markers, {
        new MarkerClusterer(map, markers, {  
          imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          gridSize: 10,
          minimumClusterSize: 2
        })
      }  

    return(
            <Fragment>
                <div className={styles.GMAP}>
                <div style={{ height: '50vh', width: '50%' }}>
                    <GoogleMapReact
                    bootstrapURLKeys={{ key: `https://maps.google.com/maps/api/js?key=AIzaSyAM0qzn6FVfsv0hvMOEn6ciTMK8at2n9fw` }}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    yesIWantToUseGoogleMapApiInternals 
                    onGoogleApiLoaded={({map, maps}) => setGoogleMapRef(map, maps)}
                    options={{ gestureHandling: "greedy", streetViewControl: true }}
                    >
                    </GoogleMapReact>
                </div>
                </div>
           </Fragment> 
    )
}

export default Map