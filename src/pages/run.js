import React, { useState, useEffect } from "react";
import { requireAuth, useAuth } from "util/auth.js";
import "pages/run.scss";

import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";

import PlaybookEdit from "components/PlaybookEdit";
import ListPlaybooksCard from "../components/ListPlaybooksCard";
import Modal from "../components/Modal";

import userSvc from "services/userService";
import driverSvc from "services/driverService";
import playbookSvc from "services/playbookService";
import domainsSvc from "services/domainsService";
import { FaArrowRight } from "react-icons/fa";

function RunPage(props) {
  const auth = useAuth();

  // State
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Loading...");
  const [playbook, setPlaybook] = useState(null);
  const [domains, setDomains] = useState([]);
  const [runState, setRunState] = useState({ type: "none", message: "" });

  const [lastLoadtestId, setLastLoadtestId] = useState("");
  const [customerPlaybooks, setCustomerPlaybooks] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("create");

  const handleRunPlaybook = async () => {
    runPlaybook(playbook);
  };

  const handleNewPlaybook = async () => {
    setPlaybook(playbookSvc.getEmptyPlaybook());
    setMode("create");
  };

  const handleCreateAndRunPlaybook = async (data) => {
    setShowModal(true);
    setModalTitle("Creating playbook...");
    const createResponse = await playbookSvc.create(data);
    if (createResponse.status === 200) {
      const playbookResponse = await playbookSvc.getById(
        createResponse.data.PlaybookId,
        0
      );
      if (playbookResponse.status === 200) {
        setPlaybook(playbookResponse.data);
        setMode("read");
        const playbooksArray = await loadCustomerPlaybooks();
        setCustomerPlaybooks(playbooksArray);
        await runPlaybook(playbookResponse.data);
      } else {
        setShowModal(false);
      }
    }
  };

  const runPlaybook = async (selectedPlaybook) => {
    setShowModal(true);
    setModalTitle("Spawning virtual users ...");
    const activePlaybook = selectedPlaybook || playbook;
    if (activePlaybook) {
      try {
        const playbookResult = await playbookSvc.getPlaybook(
          activePlaybook.PlaybookId
        );
        try {
          const { loadtestId, runResponse } = await driverSvc.triggerLoadTest(
            auth.getCurrentUser(),
            playbookResult.playbook
          );
          if (runResponse.status === 200) {
            setRunState({
              type: "success",
              message: "Successfully started loadtest. ",
            });
            setLastLoadtestId(loadtestId);
          } else {
            setRunState({
              type: "danger",
              message: runResponse.data,
            });
          }
        } catch (err) {
          console.log("Failure to run playbook.", err);
          setRunState({
            type: "danger",
            message: "Failure to run playbook.",
          });
        }
      } catch (error) {
        console.log("Cannot run playbook:", error);
      }
    }
    setShowModal(false);
  };

  const loadPlaybook = (playbook) => {
    setPlaybook(playbook);
    setMode("read");
  };

  const loadUser = async () => {
    if (user === null) {
      const { userData } = await userSvc.getUserData();
      setUser(userData);
      return userData;
    } else {
      return user;
    }
  };

  const loadCustomerPlaybooks = async () => {
    const userLocal = await loadUser();
    return await playbookSvc.getPlaybooks(
      userLocal.OrganisationId,
      auth.getCurrentUser()
    );
  };

  useEffect(async () => {
    const userLocal = await loadUser();
    const domains = await domainsSvc.getAll(userLocal.OrganisationId);

    // TODO Added moggies.io so people can test. Remove in the future
    if (domains.length == 0) {
      domains.push({
        DomainName: "moggies.io",
      });
    }
    setDomains(domains);
  }, []);

  useEffect(async () => {
    try {
      setIsLoading(true);
      const playbooksArray = await loadCustomerPlaybooks();
      setCustomerPlaybooks(playbooksArray);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setCustomerPlaybooks([]);
      setError(error);
      setIsLoading(false);
    }
  }, []);

  const footer =
    mode === "read" ? (
      <>
        <Row>
          <Col xs={"auto"} md={"auto"} lg={"auto"}>
            <Button
              size="lg"
              className="mb-0 mt-2 text-light"
              variant="danger"
              onClick={handleRunPlaybook}
            >
              Run
            </Button>
          </Col>
          <Col>
            <Button size="lg" className="mb-0 mt-2" onClick={handleNewPlaybook}>
              Create playbook
            </Button>
          </Col>
        </Row>
      </>
    ) : (
      <Col>
        <Button
          type="submit"
          size="lg"
          className="mb-0 mt-2 text-light"
          variant="danger"
        >
          Create playbook &amp; Run
        </Button>
      </Col>
    );

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
          <Alert variant={runState.type}>
            {runState.message}
            {lastLoadtestId && (
              <Link href={`/tests/${lastLoadtestId}`}>
                <a>Go to results page.</a>
              </Link>
            )}
          </Alert>
        )}
        <Row>
          <Col lg={6}>
            <Card>
              <Card.Body>
                {!playbook && (
                  <>
                    <Row>
                      <Col className="col-vcenter mb-5">
                        <h4>No playbook selected.</h4>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-vcenter">
                        <Button size="lg" onClick={handleNewPlaybook}>
                          Create playbook
                        </Button>
                      </Col>
                      <Col className="col-vcenter col-align-right">
                        Select an existing playbook <FaArrowRight />
                      </Col>
                    </Row>
                  </>
                )}
                {playbook && domains && (
                  <PlaybookEdit
                    playbook={playbook}
                    domains={domains}
                    mode={mode}
                    createButtonText="Create and run playbook"
                    onCreate={handleCreateAndRunPlaybook}
                    footer={footer}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mt-4 mt-lg-0">
            <ListPlaybooksCard
              onCardSelected={loadPlaybook}
              playbooks={customerPlaybooks}
              loading={isLoading}
              error={error}
              selected={playbook}
            />
          </Col>
        </Row>
        <Modal
          show={showModal}
          size={"lg"}
          title={modalTitle}
          content={<Spinner animation="border" variant="primary" />}
        />
      </Container>
    </Section>
  );
}

export default requireAuth(RunPage);
