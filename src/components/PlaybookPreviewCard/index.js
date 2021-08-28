import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PrettyPrintJson from "../../components/PrettyPrintJson";

import playbookSvc from "../../services/playbookService";

function PlaybookPreviewCard({ playbook, onClick }) {
  const [runEnabled, setRunEnabled] = useState(true && playbook && onClick);
  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">
          Playbook: {playbook && `${playbook.PlaybookName}:${playbook.Latest}`}
        </h5>
        {playbook ? (
          <>
            <PrettyPrintJson data={playbook} />
            {runEnabled ? (
              <Button
                variant="primary"
                onClick={async () => await onClick(setRunEnabled)}
                className="mt-3"
              >
                Start load test
              </Button>
            ) : (
              onClick && (
                <Button disabled variant="secondary" className="mt-3">
                  Loading...
                </Button>
              )
            )}
          </>
        ) : (
          <>
            <div>Load a playbook first!</div>
            {onClick && (
              <Button disabled variant="secondary" className="mt-3">
                no playbook loaded
              </Button>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
export default PlaybookPreviewCard;
