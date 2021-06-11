import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Link from "next/link";

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
            <ListGroup.Item key={item.LoadtestId}>
              <Row>
                <Col>{item.LoadtestId}</Col>
                <Col>
                  <Link href={`/tests/${item.LoadtestId}`}>
                    <a>Go to results</a>
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

export default LoadtestList;
