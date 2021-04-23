import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const playbookApiUrl = "https://api.moggies.io/playbook";

function ListPlaybooksCard(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerPlaybooks, setCustomerPlaybooks] = useState(null);

  const getCustomerPlaybooks = (customerId) => {
    const url = `${playbookApiUrl}/${customerId}`;
    return fetch(url).then((data) => data.json());
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getCustomerPlaybooks("default")
      .then((playbooksData) => {
        setCustomerPlaybooks(playbooksData.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setCustomerPlaybooks([]);
        setError(error);
        setIsLoading(false);
      });
    return () => (mounted = false);
  }, []);

  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Available load test playbooks</h5>
        {isLoading && customerPlaybooks != null ? (
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <ListGroup>
            {customerPlaybooks &&
              customerPlaybooks.map((playbook) => (
                <ListGroup.Item>
                  <Container>
                    <Row>
                      <Col lg={true}>{playbook.Playbook.name}</Col>
                      <Col>
                        <Button
                          onClick={() =>
                            props.onCardSelected(playbook.Playbook)
                          }
                        >
                          load
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default ListPlaybooksCard;
