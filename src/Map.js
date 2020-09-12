import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 24.774075,
      lng: 121.009115
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '80vh', width: '50%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'https:maps.google.com/maps/api/js?key=AIzaSyAM0qzn6FVfsv0hvMOEn6ciTMK8at2n9fw' }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={24.774075}
            lng={121.009115}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;