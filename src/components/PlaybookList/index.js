import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Link from "next/link";

import playbookSvc from "../../services/playbookService";

function PlaybookList(props) {
  const [data, setData] = useState(null);

  useEffect(() => {
    playbookSvc
      .getAll("default")
      .then((data) => {
        console.log("getAll", data);
        setData(data.data.data);
      })
      .catch((err) => console.log("getAll err", err));
  }, []);

  let component = <div>Loading...</div>;
  if (data) {
    component = (
      <>
        <ListGroup
          style={{
            overflow: "scroll",
          }}
        >
          {data.map((item, index) => (
            <ListGroup.Item key={item.PlaybookId}>
              <Row>
                <Col>{item.Name}</Col>
                <Col>
                  <Link href={`/playbooks/${item.PlaybookId}`}>
                    <a>Go to loadtests</a>
                  </Link>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    );
  }

  return component;
}

export default PlaybookList;
