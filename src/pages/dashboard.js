import React, { useState, useEffect } from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Toast from "react-bootstrap/Toast";
import axios from "axios";

const playbookApiUrl = "https://api.moggies.io/playbook";

function DashboardPage(props) {
  const defaultPlaybook = {
    id: 1,
    name: "test playbook",
    workflow: {
      steps: [
        {
          name: "Call google.com",
          type: "http_get",
          requestOptions: {
            hostname: "www.google.com",
            port: 80,
            protocol: "http",
            path: "",
          },
          users: 1,
          repeats: 10,
          wait: 5,
        },
      ],
    },
  };

  const msgSuccess = "Great success!";
  const msgFailure = "Oh no!";

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerPlaybooks, setCustomerPlaybooks] = useState(null);
  const [playbook, setPlaybook] = useState(defaultPlaybook);
  const [toastShown, setToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const runPlaybook = () => {
    makeRequest(
      playbook.workflow,
      (response) => {
        console.log("Successfully ran playbook!");
        setToastMessage(msgSuccess);
        setToastShown(true);
      },
      (err) => {
        console.log("Failure to run playbook", err);
        setToastMessage(msgFailure);
        setToastShown(true);
      }
    );
  };

  const makeRequest = (postData, onSuccess, onError) => {
    axios
      .post(
        "https://l9sbd4f7s9.execute-api.eu-west-1.amazonaws.com/v1_1/loadtest",
        postData
      )
      .then((response) => onSuccess(response))
      .catch((error) => onError(error));
  };

  const loadPlaybook = () => {
    alert("Still under construction");
  };

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
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={1}
          spaced={true}
          className="text-center"
        />
        <Toast
          onClose={() => setToastShown(false)}
          show={toastShown}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
        <Row>
          <Col lg={6}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Playbook: {playbook.name}</h5>
                <Button variant="primary" onClick={runPlaybook}>
                  Start load test{" "}
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mt-4 mt-lg-0">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Available load test playbooks</h5>
                {isLoading && customerPlaybooks != null ? (
                  <div>Loading...</div>
                ) : (
                  <ListGroup>
                    {customerPlaybooks.map((playbook) => (
                      <ListGroup.Item action onClick={loadPlaybook}>
                        {playbook.Playbook.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardPage;
