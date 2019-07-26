import * as React from 'react';
import {MyMarker} from "./MyMarker"
import distance_img from "../assets/images/distance_img.png"
const {
    Polyline,
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    GoogleMap: GoogleMapPath,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");
const _ = require("lodash");


class MyMap extends React.Component{

    componentWillMount() {
        const refs = {}
        this.setState({
            bounds: null,
            markers: [],
            onMapMounted: ref => {
                refs.map = ref;
            },
            onBoundsChanged: () => {
                this.setState({
                    bounds: refs.map.getBounds(),
                    // center: refs.map.getCenter(),
                })
            },
            onSearchBoxMounted: ref => {
                refs.searchBox = ref;
            },
            onPlacesChanged: () => {
                const places = refs.searchBox.getPlaces();

                const bounds = new window.google.maps.LatLngBounds();
                places.forEach(place => {
                    if (place.geometry.viewport) {
                        bounds.union(place.geometry.viewport)
                    } else {
                        bounds.extend(place.geometry.location)
                    }
                });

                const nextMarkers = places.map(place => {
                    // console.log(place.id)
                    this.props.getplaceId(place.place_id);
                    return {position: place.geometry.location,};
                });

                const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

                this.setState({
                    center: nextCenter,
                    markers: nextMarkers,
                });
                // state.center is center of map by searchbox
                refs.map.fitBounds(bounds);
            },
        })
    }


    render(){
        // console.log("today's plan: ", this.props.path)
        let {latlng, name}=this.props.city
        // console.log(this.props.path)
        let path = this.props.path.map(
            (spot) => (spot.latlng)
        )
        // console.log(path)
        let centers=[];
        for(let i =0;i<path.length-1;i++){
            centers.push({
                lat : (path[i].lat+path[i+1].lat)/2,
                lng : (path[i].lng+path[i+1].lng)/2,
                distance: (window.google.maps.geometry.spherical.computeDistanceBetween(
                    new window.google.maps.LatLng(path[i].lat, path[i].lng),
                    new window.google.maps.LatLng(path[i+1].lat, path[i+1].lng))/1000).toFixed(1)})
        }
        // console.log(centers)
        return (
            <GoogleMap
                ref={this.state.onMapMounted}
                defaultZoom={this.props.zoom}
                onBoundsChanged={this.state.onBoundsChanged}
                center={path ? path[0] : latlng}
            >

            <GoogleMapPath
                defaultZoom={this.props.zoom}
                // defaultCenter={new window.google.maps.LatLng(-34.397, 150.644)}
                // center = {new window.google.maps.LatLng(props.path[0].lat, props.path[0].lng)}
                center={latlng}
            >
                <SearchBox
                    ref={this.state.onSearchBoxMounted}
                    bounds={this.state.bounds}
                    controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
                    onPlacesChanged={this.state.onPlacesChanged}
                >
                    <input
                        type="text"
                        placeholder="search"
                        className = "input"
                    />
                </SearchBox>
                {/*marker from searchbox*/}
                {this.state.markers.map((marker, index) =>{
                    return <Marker key={index} position={marker.position} options={{icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'}}/>
                })}
                <Polyline
                    path={path}
                    defaultOptions={{
                        geodesic: true,
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 2,
                        icons: [{
                            icon: {
                                path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                            },
                            offset: '100%'
                        }],
                    }}
                />
                {this.props.path.map((spot, idx)=>(
                <MyMarker coor = {spot.latlng} key = {idx} name = {spot.name}/>
            ))}
                {centers.map((center, idx)=>{
                    const {lat, lng, distance} = center
                    return (
                        <MyMarker
                            coor = {{lat, lng}}
                            key = {idx}
                            name = {`${distance} km`}
                            icon={{
                                url: distance_img,
                                scaledSize: new window.google.maps.Size(30,30),
                            }}
                            padding={`3px`}
                            fontSize={`12px`}
                        />
                    )
                })}
        </GoogleMapPath>

        </GoogleMap>
    )
    }

}

export const DrawPath = withScriptjs(withGoogleMap(MyMap))

