import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Link from "next/link";

import playbookSvc from "../../services/playbookService";
import userSvc from "../../services/userService";

function PlaybookList(props) {
  const [data, setData] = useState(null);
  const loadAllPlaybooks = async () => {
    const { userData, session } = await userSvc.getUserData();
    return await playbookSvc.getAll(userData.OrganisationId);
  };

  useEffect(() => {
    loadAllPlaybooks()
      .then((data) => {
        setData(data.data.data);
      })
      .catch((err) => console.log("getAll err", err));
  }, []);

  return (
    <Container
      style={{
        overflow: "scroll",
      }}
    >
      <Row>
        <h1>Playbooks</h1>
      </Row>
      {!data && (
        <Row>
          <Col>Loading...</Col>
        </Row>
      )}
      {data &&
        data.map((item, index) => (
          <Row key={item.PlaybookId}>
            <Col>{item.Name}</Col>
            <Col>
              <Link href={`/playbooks/${item.PlaybookId}`}>
                <a>Open</a>
              </Link>
            </Col>
          </Row>
        ))}
    </Container>
  );
}

export default PlaybookList;
