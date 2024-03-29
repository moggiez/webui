import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

function PageLoader(props) {
  const { style, children, ...otherProps } = props;

  return (
    <Section
      bg="white"
      className="page-loader d-flex justify-content-center align-items-center"
      style={{
        height: "400px",
        ...style,
      }}
      {...otherProps}
    >
      <Container>
        {!props.children && <Spinner animation="border" variant="primary" />}

        {props.children && <>{props.children}</>}
      </Container>
    </Section>
  );
}

export default PageLoader;
