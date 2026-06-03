import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import axios from "axios";
import "./Hotels.css";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  useEffect(() => {
    axios
      .get(
        `https://meraki-academy-project-5-15ih.onrender.com/hotels/bestHotel/best`,
      )
      .then((result) => {
        console.log(result.data.result);
        setHotels(result.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(hotels);
  return (
    <div className="imgHotel">
      {hotels.map((ele, i) => {
        // {console.log(ele.name)}
        return (
          <div>
            <Card style={{ width: "22rem", height: "35rem", display: "grid" }}>
              <Card.Img variant="top" src={ele.image_url} />
              <Card.Body>
                <Card.Title>
                  <h1>{ele.name}</h1>

                  <h3>{ele.location}</h3>
                </Card.Title>
                <Card.Text>
                  <h3>Price : {ele.price_per_night} $</h3>
                </Card.Text>
                <Button variant="primary">See More</Button>
              </Card.Body>
            </Card>
          </div>
        );
      })}
      {/* <div>Hotels</div> */}
      {/* <Card style={{ width: "18rem" }}>
        <Card.Img
        variant="top"
          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/26/e5/9e/exterior.jpg?w=800&h=500&s=1"
        />
        <Card.Body>
          <Card.Title>Movenpick</Card.Title>
          <Card.Text>price</Card.Text>
          <Button variant="primary">See More</Button>
        </Card.Body>
      </Card> */}
    </div>
  );
};

export default Hotels;
