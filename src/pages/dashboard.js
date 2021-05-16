import React, { useState, useEffect } from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { requireAuth, useAuth } from "util/auth.js";
import PlaybookPreviewCard from "../components/PlaybookPreviewCard";
import ListPlaybooksCard from "../components/ListPlaybooksCard";

import Toast from "react-bootstrap/Toast";

import loadGeneratorService from "../services/loadGeneratorService";
import playbookSvc from "../services/playbookService";

function DashboardPage(props) {
  const auth = useAuth();
  const msgSuccess = "Great success!";
  const msgFailure = "Oh no!";

  // State
  const [playbook, setPlaybook] = useState(null);
  const [toastShown, setToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const runPlaybook = () => {
    if (playbook) {
      playbookSvc
        .getPlaybook(playbook.PlaybookId)
        .then(({ playbook, session }) => {
          loadGeneratorService.triggerLoadTest(
            auth.getCurrentUser(),
            playbook,
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
        })
        .catch((error) => console.log("Cannot run playbook:", error));
    }
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

export default requireAuth(DashboardPage);
