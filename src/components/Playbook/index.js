import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useRouter } from "next/router";

import playbookSvc from "../../services/playbookService";
import PlaybookEdit from "components/PlaybookEdit";

import userSvc from "../../services/userService";
import domainsSvc from "../../services/domainsService";

function Playbook({ id, version }) {
  const router = useRouter();
  const [playbook, setPlaybook] = useState(null);
  const [domains, setDomains] = useState([]);

  const handleChange = (pb) => {
    setPlaybook(pb);
  };

  const handleCreate = async (data) => {
    const createResponse = await playbookSvc.create(data);
    if (createResponse.status === 200) {
      router.push("/playbooks/all");
    }
  };

  const handleUpdate = async (data) => {
    const updateResponse = await playbookSvc.update(playbook.PlaybookId, data);
    if (updateResponse.status === 200) {
      router.push("/playbooks/all");
    }
  };

  useEffect(async () => {
    try {
      if (id && version) {
        let playbookData = { data: playbookSvc.getEmptyPlaybook() };
        if (id !== "new") {
          playbookData = await playbookSvc.getById(id, version);
        }
        const { userData, session } = await userSvc.getUserData();
        const domains = await domainsSvc.getAll(userData.OrganisationId);
        setPlaybook(playbookData.data);

        // TODO Added moggies.io so people can test. Remove in the future
        if (domains.length == 0) {
          domains.push({
            DomainName: "moggies.io",
          });
        }
        setDomains(domains);
      }
    } catch (err) {
      console.log("playbookSvc.getById", err);
    }
  }, [id, version]);

  console.log("Playbook", playbook);
  return (
    <Container>
      {!playbook && (
        <Row>
          <Col>Loading playbook...</Col>
        </Row>
      )}
      {playbook && (
        <Row>
          <Col xs={0} md={3} lg={3}></Col>
          <Col xs={12} md={6} lg={6}>
            <Card>
              <Card.Body>
                <PlaybookEdit
                  playbook={playbook}
                  domains={domains}
                  onChange={handleChange}
                  mode={id === "new" ? "create" : "update"}
                  onCreate={handleCreate}
                  onUpdate={handleUpdate}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={0} md={3} lg={3}></Col>
        </Row>
      )}
    </Container>
  );
}
export default Playbook;
