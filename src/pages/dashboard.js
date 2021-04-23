import React, { useState, useEffect } from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PlaybookPreviewCard from "../components/PlaybookPreviewCard";
import ListPlaybooksCard from "../components/ListPlaybooksCard";

import Toast from "react-bootstrap/Toast";
import axios from "axios";

function DashboardPage(props) {
  const msgSuccess = "Great success!";
  const msgFailure = "Oh no!";

  // State
  const [playbook, setPlaybook] = useState(null);
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

  const loadPlaybook = (playbook) => {
    setPlaybook(playbook);
  };

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
            <PlaybookPreviewCard playbook={playbook} onClick={runPlaybook} />
          </Col>
          <Col lg={6} className="mt-4 mt-lg-0">
            <ListPlaybooksCard onCardSelected={loadPlaybook} />
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardPage;
