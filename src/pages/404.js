import React from "react";
import Section from "components/Section";
import { Container, Row, Col } from "react-bootstrap";
import "pages/404.scss";

function Page404() {
  return (
    <Section>
      <Container>
        <Row>
          <Col className="col-vcenter">
            <img
              src="/images/illustrations/not_found.svg"
              alt="not found cat in a box"
              width="320"
            />
          </Col>
        </Row>
        <Row>
          <Col className="col-vcenter">
            <h1>Nothing to see here.</h1>
          </Col>
        </Row>
        <Row>
          <Col className="col-vcenter">
            <h2>404 Page Not Found</h2>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default Page404;
