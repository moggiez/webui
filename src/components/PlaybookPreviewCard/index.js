import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PrettyPrintJson from "../../components/PrettyPrintJson";

import playbookSvc from "../../services/playbookService";

function PlaybookPreviewCard(props) {
  const [runEnabled, setRunEnabled] = useState(false);
  useEffect(() => {
    if (props.playbook) {
      playbookSvc
        .getPlaybook(props.playbook.PlaybookId)
        .then(({ playbook, session }) => {
          console.log("p", playbook);
          setRunEnabled(true);
        })
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
            {runEnabled ? (
              <Button
                variant="primary"
                onClick={() => props.onClick(setRunEnabled)}
                className="mt-3"
              >
                Start load test
              </Button>
            ) : (
              <Button disabled variant="secondary" className="mt-3">
                Loading...
              </Button>
            )}
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
