import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import playbookSvc from "../../services/playbookService";

function Playbook(props) {
  const [playbook, setPlaybook] = useState(null);

  useEffect(async () => {
    try {
      const playbookData = await playbookSvc.getById(props.id);
      setPlaybook(playbookData.data);
    } catch (err) {
      console.log("playbookSvc.getById", err);
    }
  }, []);

  return (
    <Container>
      <Card>
        <Card.Body>
          <h5 className="mb-3">Name: {playbook && playbook.Name}</h5>
        </Card.Body>
      </Card>
    </Container>
  );
}
export default Playbook;
