import React, { useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PrettyPrintJson from "../../components/PrettyPrintJson";

import playbookSvc from "../../services/playbookService";

function PlaybookPreviewCard(props) {
  useEffect(() => {
    if (props.playbook) {
      playbookSvc
        .getPlaybook(props.playbook.PlaybookId)
        .then(({ playbook, session }) => console.log("p", playbook))
        .catch((error) => console.log("error", error));
    }
  }, [props]);

  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">
          Playbook: {props.playbook && props.playbook.Playbook.name}
        </h5>
        {props.playbook ? (
          <>
            <PrettyPrintJson data={props.playbook} />
            <Button variant="primary" onClick={props.onClick} className="mt-3">
              Start load test{" "}
            </Button>
          </>
        ) : (
          <>
            <div>Load a playbook first!</div>
            <Button disabled variant="secondary" className="mt-3">
              no playbook loaded
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  );
}
export default PlaybookPreviewCard;
