import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import playbookSvc from "../../services/playbookService";
import userSvc from "../../services/userService";
import { useAuth } from "../../util/auth";

function ListPlaybooksCard(props) {
  const auth = useAuth();
  const [selectedPlaybookId, setSelectedPlaybookId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerPlaybooks, setCustomerPlaybooks] = useState(null);

  const loadCustomerPlaybooks = async () => {
    const { userData, session } = await userSvc.getUserData();
    return await playbookSvc.getPlaybooks(
      userData.OrganisationId,
      auth.getCurrentUser()
    );
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    loadCustomerPlaybooks()
      .then((playbooksArray) => {
        setCustomerPlaybooks(playbooksArray);
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
        {isLoading && !customerPlaybooks ? (
          <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <ListGroup>
            {customerPlaybooks.map((playbook) => (
              <ListGroup.Item key={playbook.PlaybookId}>
                <Container>
                  <Row>
                    <Col lg={true}>{playbook.Name}</Col>
                    <Col>
                      {selectedPlaybookId != playbook.PlaybookId ? (
                        <Button
                          onClick={() => {
                            setSelectedPlaybookId(playbook.PlaybookId);
                            props.onCardSelected(playbook);
                          }}
                        >
                          Select
                        </Button>
                      ) : (
                        <Button disabled variant="secondary">
                          Selected
                        </Button>
                      )}
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
