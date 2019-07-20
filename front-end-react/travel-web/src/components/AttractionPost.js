import React, {Component} from 'react';
import {Button} from "antd";
import PropTypes from 'prop-types';

export class AttractionPost extends Component {
    static propTypes = {
        info: PropTypes.object.isRequired,
    }

    handleClick = (m) => {
        console.log({m});
    }
    render() {
        const { name, icon, photos, geometry, place_id, rating, vicinity,types} = this.props.info;
        const { location } = geometry;
        const { lat, lon } = location;
        const photoUrl ="https://s3-media3.fl.yelpcdn.com/bphoto/EmBj4qlyQaGd9Q4oXEhEeQ/ms.jpg";
        // const photourl = photos[0].getUrl();// set size of the url

        return (
            <div>
                <div className = 'place-name'>{name}</div>
                <img alt="place image" src={photoUrl}/>
                <div className = 'place-info'>
                    <p className='place-rating'>rating : {rating}</p>
                    <p className="place-address">{vicinity}</p>
                    <p className= "place-type">{types}</p>
                </div>
                <Button onClick={(e) => this.handleClick({location}, e)}>add</Button>


            </div>
        );
    }
}