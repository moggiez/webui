import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import loadtestSvc from "../../services/loadtestService";
import userSvc from "../../services/userService";

function LoadtestList(props) {
  const [data, setData] = useState(null);
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

  const handleDelete = async (id) => {
    const result = await loadtestSvc.remove(id);
    if (result.status == 200) {
      setData(data.filter((x) => x.LoadtestId != id));
    }
  };

  let component = <div>Loading...</div>;
  if (data) {
    component = (
      <Container
        style={{
          overflow: "scroll",
        }}
      >
        <Row>
          <h1>Load tests</h1>
        </Row>
        {data.map((item, index) => (
          <Row key={item.LoadtestId}>
            <Col>{item.LoadtestId}</Col>
            <Col>
              <Button href={`/tests/${item.LoadtestId}`}>Open</Button>
              <Button
                variant="danger"
                onClick={async () => await handleDelete(item.LoadtestId)}
              >
                Delete
              </Button>
            </Col>
          </Row>
        ))}
      </Container>
    );
  }

  return component;
}

export default LoadtestList;
