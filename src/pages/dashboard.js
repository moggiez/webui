import React, { useState, useEffect } from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { requireAuth, useAuth } from "util/auth.js";
import PlaybookPreviewCard from "../components/PlaybookPreviewCard";
import ListPlaybooksCard from "../components/ListPlaybooksCard";

import Alert from "react-bootstrap/Alert";

import runSvc from "../services/runService";
import playbookSvc from "../services/playbookService";

function DashboardPage(props) {
  const auth = useAuth();
  const msgSuccess = "Great success!";
  const msgFailure = "Oh no!";

  // State
  const [playbook, setPlaybook] = useState(null);
  const [runState, setRunState] = useState({ type: "none", message: "" });

  const runPlaybook = (setIsRunEnabled) => {
    if (playbook) {
      setIsRunEnabled(false);
      playbookSvc
        .getPlaybook(playbook.PlaybookId)
        .then(({ playbook, session }) => {
          runSvc
            .triggerLoadTest(auth.getCurrentUser(), playbook)
            .then((response) => {
              setRunState({
                type: "success",
                message: "Successfully ran playbook!",
              });
              setIsRunEnabled(true);
            })
            .catch((err) => {
              console.log();
              setRunState({
                type: "danger",
                message: "Failure to run playbook.",
              });
              setIsRunEnabled(true);
            });
        })
        .catch((error) => {
          console.log("Cannot run playbook:", error);
          setIsRunEnabled(true);
        });
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
        {runState.type != "none" && !runState.closed && (
          <Alert variant={runState.type}>{runState.message}</Alert>
        )}
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
