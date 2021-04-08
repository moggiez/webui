import React, { useState } from "react";
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

function DashboardPage(props) {
  const defaultPlaybook = {
    id:1,
    name:"test playbook",
    workflow: {
      payload: {
        request: {
          options: {
            hostname: "www.google.com",
            port: 80,
            protocol: "http:"
          }
        }
      }
    }
  }
  const msgSuccess = "Great success!";
  const msgFailure = "Oh no!";
  const [playbook, setPlaybook] = useState(defaultPlaybook);
  const [toastShown, setToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const runPlaybook = () => {    
    makeRequest(
      playbook.workflow.payload,
      response => {
        console.log("Successfully ran playbook!");
        setToastMessage(msgSuccess);
        setToastShown(true);
      },
      err => {
        console.log("Failure to run playbook", err);
        setToastMessage(msgFailure);
        setToastShown(true);
      }
    );
  }

  const makeRequest = (postData, onSuccess, onError) => {
    axios.post("https://l9sbd4f7s9.execute-api.eu-west-1.amazonaws.com/v1_1/loadtest", postData)
    .then(response => onSuccess(response))
    .catch(error => onError(error));
  }

  const loadPlaybook = () => {
    alert('Still under construction');
  }
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
        <Toast onClose={() => setToastShown(false)} show={toastShown} delay={3000} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
        <Row>
          <Col lg={6}>            
            <Card>
                <Card.Body>
                  <h5 className="mb-3">Playbook: {playbook.name}</h5>
                  <Button variant="primary" onClick={runPlaybook}>Start load test </Button>
                </Card.Body>
              </Card>
          </Col>
          <Col lg={6} className="mt-4 mt-lg-0">
            <Card>
              <Card.Body>
                <h5 className="mb-3">Available load test playbooks</h5>
                <ListGroup>
                  <ListGroup.Item action onClick={loadPlaybook}>Cras justo odio</ListGroup.Item>
                  <ListGroup.Item action onClick={loadPlaybook}>Dapibus ac facilisis in</ListGroup.Item>
                  <ListGroup.Item action onClick={loadPlaybook}>Morbi leo risus</ListGroup.Item>
                  <ListGroup.Item action onClick={loadPlaybook}>Porta ac consectetur ac</ListGroup.Item>
                  <ListGroup.Item action onClick={loadPlaybook}>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardPage;