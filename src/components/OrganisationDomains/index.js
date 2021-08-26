import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import { useForm } from "react-hook-form";
import { ListGroup } from "react-bootstrap";
import FormAlert from "components/FormAlert";
import Modal from "react-bootstrap/Modal";
import isValidDomain from "is-valid-domain";
import "./OrganisationDomains.module.scss";

function OrganisationDomains(props) {
  const [showModal, setShowModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [formAlert, setFormAlert] = useState(null);
  const { register, handleSubmit, errors, setError, clearErrors, setValue } =
    useForm();

  const onShowDomainSettings = (domain) => {
    setSelectedDomain(domain);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDomain(null);
  };

  const validateDomainName = (data) => {
    if (!isValidDomain(data.domainName)) {
      setError(
        "domainName",
        {
          type: "manual",
          message: "Invalid domain name.",
        },
        { shouldFocus: true }
      );
      return false;
    }

    if (!isValidDomain(data.domainName, { subdomain: false })) {
      setError(
        "domainName",
        {
          type: "manual",
          message: "Subdomains not allowed.",
        },
        { shouldFocus: true }
      );
      return false;
    }

    clearErrors("domainName");

    return true;
  };
  return (
    <>
      {/* MEMBERS */}
      <h1 className={"mt-5"}>Domains</h1>
      {!props.domains && (
        <Spinner
          animation="border"
          size="sm"
          role="status"
          aria-hidden={true}
          className="align-baseline"
        />
      )}
      {props.domains && (
        <ListGroup>
          {props.domains.map((d) => {
            let classes = "bg-success";
            switch (d.ValidationState) {
              case "VALID":
                classes = "bg-success";
                break;
              case "PENDING":
                classes = "bg-warning";
                break;
              case "INVALID":
                classes = "bg-danger text-dark";
                break;
              default:
                classes = "bg-info";
                break;
            }
            return (
              <ListGroup.Item key={d.DomainName}>
                <Row>
                  <Col className={"col-vcenter"}>{d.DomainName}</Col>
                  <Col className={"col-vcenter"}>
                    <Button
                      variant="link"
                      onClick={() => onShowDomainSettings(d)}
                    >
                      Settings
                    </Button>
                  </Col>
                  <Col className={"col-vcenter"}>
                    <Badge className={classes}>{d.ValidationState}</Badge>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
      {props.organisation &&
        props.user &&
        props.organisation.Owner == props.user.getUsername() && (
          <Form
            onSubmit={handleSubmit(async (data) => {
              if (validateDomainName(data)) {
                const result = await props.onAddDoamin(data, setFormAlert);
                if (result) {
                  setValue("domainName", "", { shouldDirty: false });
                }
              }
            })}
          >
            {formAlert && (
              <FormAlert type={formAlert.type} message={formAlert.message} />
            )}
            <Form.Row className="mt-3">
              <Col>
                <Form.Label>Add new domain:</Form.Label>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col column="xl">
                <FormField
                  name="domainName"
                  type="tetxt"
                  defaultValue={""}
                  placeholder="domain"
                  error={errors.domainName}
                  size="lg"
                  inputRef={register({
                    required: "Please enter the domain name.",
                  })}
                />
              </Col>
              <Col>
                <Button type="submit" size="lg" className="mb-0 mt-2">
                  Add domain
                </Button>
              </Col>
            </Form.Row>
          </Form>
        )}
      <Modal
        show={showModal}
        size="lg"
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>DNS Validation</h3>
          <Row>
            <Col>
              <i>Add the following DNS record to validate the domain.</i>
            </Col>
          </Row>
          <Row>
            <Col xs={1} md={2} lg={2}>
              <strong>Record type:</strong>
            </Col>
            <Col>CNAME</Col>
          </Row>
          <Row>
            <Col xs={1} md={2} lg={2}>
              <strong>Record name:</strong>
            </Col>
            <Col>{selectedDomain && selectedDomain.ValidationRecordName}</Col>
          </Row>
          <Row>
            <Col xs={1} md={2} lg={2}>
              <strong>Value</strong>
            </Col>
            <Col>{selectedDomain && selectedDomain.ValidationRecordValue}</Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrganisationDomains;
