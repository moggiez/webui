import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import playbookSvc from "../../services/playbookService";

function Playbook({ id, version }) {
  const [playbook, setPlaybook] = useState(null);

  useEffect(async () => {
    try {
      const playbookData = await playbookSvc.getById(id, version);
      setPlaybook(playbookData.data);
    } catch (err) {
      console.log("playbookSvc.getById", err);
    }
  }, [id, version]);

  return (
    <Container>
      {!playbook && (
        <Row>
          <Col>Loading playbook...</Col>
        </Row>
      )}
      {playbook && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Name: {playbook.PlaybookName}</h5>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
export default Playbook;
