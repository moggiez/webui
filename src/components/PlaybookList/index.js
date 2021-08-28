import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";

import playbookSvc from "../../services/playbookService";
import userSvc from "../../services/userService";

function PlaybookList(props) {
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

  useEffect(() => {
    loadAllPlaybooks()
      .then((data) => {
        setData(data.data);
      })
      .catch((err) => console.log("getAll err", err));
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

  const handleRunClick = (playbookId) => {
    if (selectPlaybook(playbookId)) {
      setShowRun(true);
    }
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
              <Button>Add new</Button>
            </div>
          </Col>
        </Row>
      </div>
      <Table responsive="sm" hover striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Version</th>
            <th>Last run</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data && (
            <tr>
              <td colSpan={3}>
                <div class="d-flex justify-content-center">Loading data...</div>
              </td>
            </tr>
          )}
          {data && data.length == 0 && (
            <tr>
              <td colSpan={3}>
                <div class="d-flex justify-content-center">No playbooks.</div>
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
                  <Link href={`/playbooks/${item.PlaybookId}:${item.Latest}`}>
                    <a className="ml-1">2021-07-09</a>
                  </Link>
                </td>
                <td>
                  <Button
                    variant="link"
                    className="ml-1 p-0 border-0 align-baseline"
                    onClick={() => handleRunClick(item.PlaybookId)}
                  >
                    Run
                  </Button>
                  <Link href={`/playbooks/${item.PlaybookId}_${item.Latest}`}>
                    <a className="ml-1">Edit</a>
                  </Link>
                  <Button
                    variant="link"
                    className="ml-1 p-0 border-0 align-baseline"
                    onClick={() => handleDeleteClick(item.PlaybookId)}
                  >
                    Delete
                  </Button>
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
          <Button variant="danger">Delete</Button>
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
