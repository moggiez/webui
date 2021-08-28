import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Modal,
  Button,
  Table,
  Container,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import Link from "next/link";
import { FaRunning, FaEdit, FaTrash } from "react-icons/fa";

import playbookSvc from "../../services/playbookService";
import userSvc from "../../services/userService";

function PlaybookList() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);

  const [showRun, setShowRun] = useState(false);
  const handleCloseRun = () => setShowRun(false);

  const loadAllPlaybooks = async () => {
    const { userData, _ } = await userSvc.getUserData();
    return await playbookSvc.getAll(userData.OrganisationId);
  };

  const loadPlaybooks = async () => {
    try {
      const data = await loadAllPlaybooks();
      setData(data.data);
    } catch (err) {
      console.log("getAll err", err);
    }
  };

  useEffect(async () => {
    await loadPlaybooks();
  }, []);

  const selectPlaybook = (playbookId) => {
    const playbooks = data.filter((item) => item.PlaybookId == playbookId);
    const playbook = playbooks && playbooks.length > 0 ? playbooks[0] : null;
    setSelectedPlaybook(playbook);

    return playbook != null && playbook != undefined;
  };

  const handleDeleteClick = (playbookId) => {
    if (selectPlaybook(playbookId)) {
      setShowDelete(true);
    }
  };

  const handleDelete = async () => {
    if (selectedPlaybook) {
      const deleteResponse = await playbookSvc.delete(
        selectedPlaybook.PlaybookId
      );
      setShowDelete(false);
      if (deleteResponse.status === 200) {
        await loadPlaybooks();
      }
    }
  };

  const handleRunClick = (playbookId) => {
    if (selectPlaybook(playbookId)) {
      setShowRun(true);
    }
  };

  const handleAddNew = () => {
    router.push("/playbooks/new:0");
  };

  return (
    <Container
      style={{
        overflow: "scroll",
      }}
    >
      <div>
        <Row>
          <Col>
            <h1>Playbooks</h1>
          </Col>
          <Col>
            <div className="align-bottom">
              <Button onClick={handleAddNew}>Add new</Button>
            </div>
          </Col>
        </Row>
      </div>
      <Table responsive="sm" hover striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data && (
            <tr>
              <td colSpan={3}>
                <div className="d-flex justify-content-center">
                  Loading data...
                </div>
              </td>
            </tr>
          )}
          {data && data.length == 0 && (
            <tr>
              <td colSpan={3}>
                <div className="d-flex justify-content-center">
                  No playbooks.
                </div>
              </td>
            </tr>
          )}
          {data &&
            data.map((item, _) => (
              <tr key={item.PlaybookId}>
                <td>{item.PlaybookName}</td>
                <td>
                  <Link href={`/playbooks/${item.PlaybookId}:${item.Latest}`}>
                    <a className="ml-1">{item.Latest}</a>
                  </Link>
                </td>
                <td>
                  <OverlayTrigger
                    key="run"
                    placement="left"
                    overlay={<Tooltip id={"tooltip-run"}>Run playbook</Tooltip>}
                  >
                    <Button
                      variant="link"
                      className="ml-1 p-0 border-0 align-baseline"
                      onClick={() => handleRunClick(item.PlaybookId)}
                    >
                      <FaRunning />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    key="edit"
                    placement="top"
                    overlay={
                      <Tooltip id={"tooltip-run"}>Edit playbook</Tooltip>
                    }
                  >
                    <Button
                      variant="link"
                      className="ml-1 p-0 border-0 align-baseline"
                      onClick={() =>
                        router.push(
                          `/playbooks/${item.PlaybookId}:${item.Latest}`
                        )
                      }
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    key="remove"
                    placement="right"
                    overlay={
                      <Tooltip id={"tooltip-run"}>Delete playbook</Tooltip>
                    }
                  >
                    <Button
                      variant="link"
                      className="ml-1 p-0 border-0 align-baseline"
                      onClick={() => handleDeleteClick(item.PlaybookId)}
                    >
                      <FaTrash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      <Modal
        show={showDelete}
        onHide={handleCloseDelete}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete playbook</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to delete playbook{" "}
          <strong>{selectedPlaybook && selectedPlaybook.PlaybookName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showRun}
        onHide={handleCloseRun}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Run playbook</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to run playbook{" "}
          <strong>{selectedPlaybook && selectedPlaybook.PlaybookName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRun}>
            Close
          </Button>
          <Button variant="primary">Run</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PlaybookList;
