import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Link from "next/link";

import loadtestSvc from "../../services/loadtestService";
import userSvc from "../../services/userService";

function LoadtestList(props) {
  const [data, setData] = useState(null);
  const [selectedLoadtest, setSelectedLoadtest] = useState(null);

  const [showDelete, setShowDelete] = useState(false);
  const handleCloseDelete = () => setShowDelete(false);

  const loadAllLoadtests = async () => {
    const { userData, session } = await userSvc.getUserData();
    return await loadtestSvc.getAll(userData.OrganisationId);
  };

  useEffect(() => {
    loadAllLoadtests()
      .then((data) => {
        setData(data.data.data);
      })
      .catch((err) => console.log("getAll err", err));
  }, []);

  const selectLoadtest = (loadtestId) => {
    const loadtests = data.filter((item) => item.LoadtestId == loadtestId);
    const loadtest = loadtests && loadtests.length > 0 ? loadtests[0] : null;
    setSelectedLoadtest(loadtest);

    return loadtest != null && loadtest != undefined;
  };

  const handleDeleteClick = (loadtestId) => {
    if (selectLoadtest(loadtestId)) {
      setShowDelete(true);
    }
  };

  const handleDelete = async () => {
    const result = await loadtestSvc.remove(selectedLoadtest.LoadtestId);
    if (result.status == 200) {
      setData(data.filter((x) => x.LoadtestId != selectedLoadtest.LoadtestId));
    }
  };

  return (
    <Container
      style={{
        overflow: "scroll",
      }}
    >
      <div>
        <h1>Load tests</h1>
      </div>
      <Table responsive="sm" hover striped>
        <thead>
          <tr>
            <th>Id</th>
            <th>Date start</th>
            <th>Date end</th>
            <th>Playbook</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {!data && (
            <tr>
              <td colspan={5}>
                <div class="d-flex justify-content-center">Loading data...</div>
              </td>
            </tr>
          )}
          {data &&
            data.map((item, _) => (
              <tr key={item.LoadtestId}>
                <td>{item.LoadtestId}</td>
                <td>N/A</td>
                <td>N/A</td>
                <td>
                  <Link href={`/tests/${item.LoadtestId}`}>
                    <a className="ml-1">View</a>
                  </Link>
                </td>
                <td>
                  <Link href={`/tests/${item.LoadtestId}`}>
                    <a>Results</a>
                  </Link>
                  <Button
                    variant="link"
                    className="ml-1 p-0 border-0 align-baseline"
                    onClick={() => handleDeleteClick(item.LoadtestId)}
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
          <Modal.Title>Delete loadtest</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you want to delete loadtest{" "}
          <strong>{selectedLoadtest && selectedLoadtest.LoadtestId}</strong>?
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
    </Container>
  );
}

export default LoadtestList;
