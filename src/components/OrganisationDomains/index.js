import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "components/FormField";
import {
  Row,
  Col,
  Badge,
  Alert,
  Spinner,
  Button,
  Form,
  ListGroup,
} from "react-bootstrap";
import FormAlert from "components/FormAlert";
import Modal from "../Modal";
import isValidDomain from "is-valid-domain";
import { FaTrash } from "react-icons/fa";
import "./OrganisationDomains.module.scss";

function AddDomainUnavailable() {
  return (
    <Alert variant="info">Only the organisation owner can add domains.</Alert>
  );
}

function AddDomainForm({ formAlert, setFormAlert, onAddDoamin }) {
  const { register, handleSubmit, errors, setError, clearErrors, setValue } =
    useForm();
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
    <Form
      onSubmit={handleSubmit(async (data) => {
        if (validateDomainName(data)) {
          const result = await onAddDoamin(data, setFormAlert);
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
            type="text"
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
  );
}

function OrganisationDomains({
  user,
  domains,
  organisation,
  onDelete,
  onAddDoamin,
}) {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [modalSettings, setModalSettings] = useState({});
  const [formAlert, setFormAlert] = useState(null);

  const triggerDelete = (domain) => {
    onDelete(domain, setFormAlert);
    closeModal();
  };

  const onShowDelete = (domain) => {
    setSelectedDomain(domain);

    const modalButtons = (
      <>
        <Button variant="danger" onClick={() => triggerDelete(domain)}>
          Delete
        </Button>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </>
    );

    setModalSettings({
      show: true,
      title: `Delete ${domain.DomainName}`,
      content: <>Do you want to delete {domain.DomainName}?</>,
      footer: modalButtons,
      onClick: closeModal,
    });
  };

  const onShowDomainSettings = (domain) => {
    setSelectedDomain(domain);

    const modalButtons = (
      <>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
      </>
    );

    const modalCont = (
      <>
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
          <Col>{domain && domain.ValidationRecordName}</Col>
        </Row>
        <Row>
          <Col xs={1} md={2} lg={2}>
            <strong>Value</strong>
          </Col>
          <Col>{domain && domain.ValidationRecordValue}</Col>
        </Row>
      </>
    );

    setModalSettings({
      show: true,
      title: "Settings",
      content: modalCont,
      footer: modalButtons,
      onClick: closeModal,
    });
  };

  const closeModal = () => {
    setSelectedDomain(null);
    setModalSettings({ show: false });
  };
  return (
    <>
      {/* MEMBERS */}
      <h1 className={"mt-5"}>Domains</h1>
      {!domains && (
        <Spinner
          animation="border"
          size="sm"
          role="status"
          aria-hidden={true}
          className="align-baseline"
        />
      )}
      {domains && (
        <ListGroup>
          {domains.map((d) => {
            let classes = "bg-success";
            switch (d.ValidationState) {
              case "VALID":
                classes = "bg-success";
                break;
              case "PENDING":
                classes = "bg-warning";
                break;
              case "INVALID":
                classes = "bg-danger";
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
                  <Col className={"col-vcenter"}>
                    <Button
                      variant="link"
                      className={"del-button"}
                      onClick={() => onShowDelete(d)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
      {(organisation && user && organisation.Owner === user.getUsername() && (
        <AddDomainForm
          formAlert={formAlert}
          setFormAlert={setFormAlert}
          onAddDoamin={onAddDoamin}
        />
      )) ||
        (organisation && user && organisation.Owner !== user.getUsername() && (
          <AddDomainUnavailable />
        ))}
      <Modal {...modalSettings} />
    </>
  );
}

export default OrganisationDomains;
