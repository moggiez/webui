import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Col, Button, Form } from "react-bootstrap";
import FormField from "components/FormField";

import { parseDomain, ParseResultType } from "parse-domain";

function PlaybookEdit({
  playbook,
  domains,
  onChange,
  mode,
  onCreate,
  onUpdate,
  footer,
}) {
  const [activeCopy, setActiveCopyInternal] = useState({ ...playbook });
  const [formAlert, setFormAlert] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  const parseHostname = (pb) => {
    let defaultDomain = "";
    let defaultSubdomain = "";
    if (
      "Steps" in pb &&
      pb.Steps.length > 0 &&
      pb.Steps[0].requestOptions.hostname
    ) {
      try {
        const { subDomains, domain, topLevelDomains } = parseDomain(
          pb.Steps[0].requestOptions.hostname
        );
        defaultDomain =
          domain && topLevelDomains
            ? `${domain}.${topLevelDomains.join(".")}`
            : "";
        defaultSubdomain = subDomains ? subDomains.join(".") : "";
      } catch (err) {
        console.log("cannot parse domains from playbook step hostname", err);
      }
    }
    return { parsedSubDomain: defaultSubdomain, parsedDomain: defaultDomain };
  };

  const { parsedSubDomain, parsedDomain } = parseHostname(playbook);
  const [subdomain, setSubdomain] = useState(parsedSubDomain);
  const [domain, setDomain] = useState(parsedDomain);

  const parsedProtocol = playbook
    ? playbook.Steps[0].requestOptions.protocol
    : "http";
  const [protocol, setProtocol] = useState(parsedProtocol);

  const setActiveCopy = (ac) => {
    setActiveCopyInternal(ac);
    if (onChange) {
      onChange(ac);
    }
  };

  const setSelectedDomain = (domainName) => {
    activeCopy.Steps[0].requestOptions.hostname = domainName;
    setActiveCopy(activeCopy);
  };

  const onSubmitForm = (data) => {
    const hostname = `${subdomain}.${domain}`;
    const payload = {
      PlaybookName: data.playbookName,
      Steps: [
        {
          requestOptions: {
            hostname: hostname,
            port: data.port,
            path: data.path,
            protocol: protocol,
          },
          users: data.users,
          wait: data.wait,
          repeats: data.repeats,
          type: "http_get",
        },
      ],
    };
    if (mode === "create") {
      onCreate(payload);
    } else if (mode === "update") {
      onUpdate(payload);
    }
  };

  const isReadOnly = mode === "read";

  return (
    <Form onSubmit={handleSubmit(onSubmitForm)}>
      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}
      <Form.Row className="mt-3">
        <Col>
          <Form.Label>
            <strong>Playbook name:</strong>
          </Form.Label>
        </Col>
      </Form.Row>
      {!isReadOnly && (
        <Form.Row>
          <FormField
            name="playbookName"
            type="text"
            placeholder="Enter playbook name"
            inputRef={register({
              required: "Please enter the playbook name.",
            })}
            defaultValue={playbook ? playbook.PlaybookName : ""}
            error={errors.playbookName}
            size="md"
            disabled={isReadOnly}
          />
        </Form.Row>
      )}
      {isReadOnly && (
        <Form.Row className="mt-2 mb-2">
          {playbook && playbook.PlaybookName}
        </Form.Row>
      )}

      <Form.Row className="mt-3">
        <Col>
          <Form.Label>
            <strong>Url:</strong>
          </Form.Label>
        </Col>
      </Form.Row>
      {!isReadOnly && (
        <Form.Row>
          <Row>
            <Col xs={2} md={2} lg={2}>
              <Form.Control
                as="select"
                defaultValue={protocol === "" ? parsedProtocol : protocol}
                onChange={(e) => {
                  setProtocol(e.target.value);
                }}
                inputRef={register()}
                name="protocol"
                type="select"
                disabled={isReadOnly}
              >
                <option value="http">http://</option>
                <option value="https">https://</option>
              </Form.Control>
            </Col>
            <Col xs={2} md={2} lg={2}>
              <Row>
                <Col>
                  <FormField
                    name="subdomainName"
                    type="text"
                    placeholder="Enter subdomain name"
                    inputRef={register()}
                    defaultValue={"www"}
                    value={subdomain === "" ? parsedSubDomain : subdomain}
                    onChange={(e) => {
                      setSubdomain(e.target.value);
                    }}
                    error={errors.subdomainName}
                    size="md"
                    disabled={isReadOnly}
                  />
                </Col>
                <Col xs={1} md={1} lg={1}>
                  .
                </Col>
              </Row>
            </Col>
            <Col xs={3} md={3} lg={3}>
              <Row>
                <Col>
                  <Form.Control
                    as="select"
                    value={domain === "" ? parsedDomain : domain}
                    defaultValue={""}
                    onChange={(e) => {
                      setDomain(e.target.value);
                      setSelectedDomain(e.target.value);
                    }}
                    name="domainName"
                    type="select"
                    isInvalid={errors.domainName ? true : undefined}
                    ref={register({
                      required: "Please select one of the available domains.",
                    })}
                    disabled={isReadOnly}
                  >
                    <option value="" disabled selected>
                      Select a domain
                    </option>
                    {domains &&
                      domains.map((domain) => (
                        <option
                          key={domain.DomainName}
                          value={domain.DomainName}
                        >
                          {domain.DomainName}
                        </option>
                      ))}
                  </Form.Control>
                  {errors.domainName && (
                    <Form.Control.Feedback type="invalid" className="text-left">
                      {errors.domainName.message}
                    </Form.Control.Feedback>
                  )}
                </Col>
                <Col xs={1} md={1} lg={1}>
                  :
                </Col>
              </Row>
            </Col>
            <Col xs={2} md={2} lg={2}>
              <FormField
                name="port"
                type="number"
                placeholder="80"
                defaultValue={
                  playbook ? playbook.Steps[0].requestOptions.port : 80
                }
                inputRef={register()}
                error={errors.port}
                size="md"
                disabled={isReadOnly}
              />
            </Col>
            <Col xs={3} md={3} lg={3}>
              <FormField
                name="path"
                type="text"
                placeholder="Enter path"
                inputRef={register({
                  required: "Please enter the path.",
                })}
                defaultValue={
                  playbook ? playbook.Steps[0].requestOptions.path : "/"
                }
                error={errors.path}
                size="md"
                disabled={isReadOnly}
              />
            </Col>
          </Row>
        </Form.Row>
      )}
      {isReadOnly && (
        <Form.Row className="mt-2 mb-2">
          {playbook &&
            `${protocol}://${playbook.Steps[0].requestOptions.hostname}:${playbook.Steps[0].requestOptions.port}${playbook.Steps[0].requestOptions.path}`}
        </Form.Row>
      )}

      <Form.Row className="mt-3">
        <Col>
          <Form.Label>
            <strong>Virtual users:</strong>
          </Form.Label>
        </Col>
      </Form.Row>
      {!isReadOnly && (
        <Form.Row>
          <FormField
            name="users"
            type="number"
            placeholder="Enter virtual users number."
            inputRef={register({
              required: "Please enter the virtual users number.",
              min: 1,
              max: 100,
            })}
            defaultValue={playbook ? playbook.Steps[0].users : 100}
            error={errors.users}
            size="md"
            disabled={isReadOnly}
          />
        </Form.Row>
      )}
      {isReadOnly && (
        <Form.Row className="mt-2 mb-2">
          {playbook && playbook.Steps[0].users}
        </Form.Row>
      )}

      <Form.Row className="mt-3">
        <Col>
          <Form.Label>
            <strong>Number of requests:</strong>
          </Form.Label>
        </Col>
      </Form.Row>
      {!isReadOnly && (
        <Form.Row>
          <FormField
            name="repeats"
            type="number"
            placeholder="Enter the number of requests per user."
            inputRef={register({
              required: "Please enter the number of requests per user.",
            })}
            defaultValue={playbook ? playbook.Steps[0].repeats : 1}
            error={errors.repeats}
            size="md"
            disabled={isReadOnly}
          />
        </Form.Row>
      )}
      {isReadOnly && (
        <Form.Row className="mt-2 mb-2">
          {playbook && playbook.Steps[0].repeats}
        </Form.Row>
      )}

      <Form.Row className="mt-3">
        <Col>
          <Form.Label>
            <strong>Pause between requests:</strong>
          </Form.Label>
        </Col>
      </Form.Row>
      {!isReadOnly && (
        <Form.Row>
          <FormField
            name="wait"
            type="number"
            placeholder="Enter the wait time between requests."
            inputRef={register({
              required: "Please enter the wait time between requests.",
            })}
            defaultValue={playbook ? playbook.Steps[0].wait : 0}
            error={errors.wait}
            size="md"
            disabled={isReadOnly}
          />
        </Form.Row>
      )}
      {isReadOnly && (
        <Form.Row className="mt-2 mb-4  ">
          {playbook && playbook.Steps[0].wait}
        </Form.Row>
      )}

      {!footer && (
        <Form.Row>
          <Col>
            {mode === "create" && (
              <Button type="submit" size="lg" className="mb-0 mt-2">
                {createButtonText}
              </Button>
            )}
            {mode === "update" && (
              <Button type="submit" size="lg" className="mb-0 mt-2">
                Save playbook
              </Button>
            )}
          </Col>
        </Form.Row>
      )}
      {footer && <Form.Row>{footer}</Form.Row>}
    </Form>
  );
}
export default PlaybookEdit;
