import React, { useState } from "react";
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
import Modal from "../Modal";
import isValidDomain from "is-valid-domain";
import { FaTrash } from "react-icons/fa";
import "./OrganisationDomains.module.scss";

function OrganisationDomains(props) {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [modalSettings, setModalSettings] = useState({});
  const [formAlert, setFormAlert] = useState(null);
  const { register, handleSubmit, errors, setError, clearErrors, setValue } =
    useForm();

  const triggerDelete = (domain) => {
    props.onDelete(domain, setFormAlert);
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
      <Modal {...modalSettings} />
    </>
  );
}

export default OrganisationDomains;
