import React, { useState } from "react";
import {
  Card,
  Button,
  Spinner,
  ListGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import Link from "next/link";

function ListPlaybooksCard({
  onCardSelected,
  playbooks,
  loading,
  error,
  selected,
}) {
  return (
    <Card>
      <Card.Body>
        <h5 className="mb-3">Playbooks</h5>
        {loading && !playbooks ? (
          <Spinner animation="border" variant="primary" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        ) : (
          <ListGroup>
            {playbooks &&
              playbooks.map((playbook) => (
                <ListGroup.Item key={playbook.PlaybookId}>
                  <Container>
                    <Row>
                      <Col lg={true}>
                        <Link
                          href={`/playbooks/${playbook.PlaybookId}:${playbook.Latest}`}
                        >
                          <a className="ml-1">
                            {playbook.PlaybookName}:{playbook.Latest}
                          </a>
                        </Link>
                      </Col>
                      <Col>
                        {(selected &&
                          selected.PlaybookId != playbook.PlaybookId) ||
                        !selected ? (
                          <Button
                            onClick={() => {
                              onCardSelected(playbook);
                            }}
                          >
                            Select
                          </Button>
                        ) : (
                          <Button disabled variant="secondary">
                            Selected
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Container>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

export default ListPlaybooksCard;
