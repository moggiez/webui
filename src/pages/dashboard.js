import React, { useState } from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import https from "https";
import querystring from "querystring";

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
  const [playbook, setPlaybook] = useState(defaultPlaybook);
  
  const runPlaybook = () => {    
    const postData = querystring.stringify(playbook.workflow.payload);
    makeRequest(
      postData,
      data => console.log("Successfully ran playbook!"),
      err => console.log("Failure to run playbook", err)
    );
  }

  const makeRequest = (data, onSuccess, onError) => {

    const options = {
      hostname: "frfjmlbr81.execute-api.eu-west-1.amazonaws.com",
      port: 443,
      path: "/prod",
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }

    }

    const processResponse = (res) => {
      let buffer = "";
      res.on("data", (chunk) => (buffer += chunk));
      res.on("end", () => onSuccess(res.statusCode, buffer));
    };
    const req = https.request(options, processResponse);
    req.on("error", (e) => onError(e.message));
    req.end();
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