import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useForm } from "react-hook-form";
import { ListGroup } from "react-bootstrap";
import FormAlert from "components/FormAlert";

function OrganisationMembers(props) {
  const [formAlert, setFormAlert] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  return (
    <>
      {/* MEMBERS */}
      <h1 className={"mt-5"}>Members</h1>
      {props.members && (
        <ListGroup>
          {props.members.map((m) => (
            <ListGroup.Item key={m}>{m}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
      {props.organisation &&
        props.user &&
        props.organisation.Owner == props.user.getUsername() && (
          <Form
            onSubmit={handleSubmit(
              async (data) => await props.onInvite(data, setFormAlert)
            )}
          >
            {formAlert && (
              <FormAlert type={formAlert.type} message={formAlert.message} />
            )}
            <Form.Row className="mt-3">
              <Col>
                <Form.Label>Invite new member:</Form.Label>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col column="xl">
                <FormField
                  name="inviteEmail"
                  type="email"
                  defaultValue={""}
                  placeholder="email"
                  error={errors.inviteEmail}
                  size="lg"
                  inputRef={register({
                    required: "Please enter the email of the invitee",
                  })}
                />
              </Col>
              <Col>
                <Button type="submit" size="lg" className="mb-0 mt-2">
                  Invite new member
                </Button>
              </Col>
            </Form.Row>
          </Form>
        )}
    </>
  );
}

export default OrganisationMembers;
