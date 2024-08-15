import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import img from "../../assets/logo.png";
import "./Card.css"; // Import the custom CSS file

function Cards() {
  return (
    <Card className="custom-card" style={{ width: "18rem" }}>
      <Card.Img
        className="custom-card-img"
        variant="top"
        src={img}
        alt="Card image"
      />
      <Card.Body>
        <Card.Title>Ryzen_xp</Card.Title>
        <Card.Text>Some quick example</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}

export default Cards;
