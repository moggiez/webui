import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";
import { ListGroup } from "react-bootstrap";
import FormAlert from "components/FormAlert";

import userService from "../services/userService";
import { getUserAttributes, inviteUser } from "../services/cognitoAuth";

function SettingsOrganisation(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const [organisation, setOrganisation] = useState({
    name: "Moggies",
    owner: auth.user ? auth.user.getUsername() : "",
  });

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    // Show pending indicator
    setPending(true);

    return auth
      .updateProfile(data)
      .then(() => {
        // Set success status
        props.onStatus({
          type: "success",
          message: "Your profile has been updated",
        });
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          props.onStatus({
            type: "requires-recent-login",
            // Resubmit after reauth flow
            callback: () => onSubmit(data),
          });
        } else {
          // Set error status
          props.onStatus({
            type: "error",
            message: error.message,
          });
        }
      })
      .finally(() => {
        // Hide pending indicator
        setPending(false);
      });
  };

  const onInviteSubmit = (data) => {
    inviteUser(
      data.inviteEmail,
      organisation.Owner,
      organisation.OrganisationId
    )
      .then(() => {
        setFormAlert({
          type: "success",
          message: `${data.inviteEmail} was invited to join you organisation.`,
        });
      })
      .catch((err) => {
        setFormAlert({
          type: "error",
          message: err.message,
        });
      });
  };

  useEffect(() => {
    userService
      .getUserData()
      .then(({ userData, session }) => {
        setOrganisation(userData);
      })
      .catch((err) => console.log("NO USER DATA ", err));
  }, []);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formName">
          <FormField
            name="name"
            type="text"
            label="Organisation Name"
            defaultValue={organisation.Name}
            disabled
            placeholder="Organisation Name"
            error={errors.name}
            size="lg"
            inputRef={register({
              required: "Please enter your name",
            })}
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <FormField
            name="owner"
            type="text"
            label="Organisation Owner"
            defaultValue={
              auth.user && organisation.Owner == auth.user.getUsername()
                ? "you"
                : organisation.Owner
            }
            placeholder="Who is the owner?"
            disabled
            error={errors.email}
            size="lg"
            inputRef={register({
              required: "Please enter your email",
            })}
          />
        </Form.Group>
        <label>Members</label>
        <ListGroup>
          <ListGroup.Item>stavrev.georgi@gmail.com</ListGroup.Item>
          <ListGroup.Item>georgi@moggies.io</ListGroup.Item>
          <ListGroup.Item>gabriela@moggies.io</ListGroup.Item>
        </ListGroup>

        <Button type="submit" size="lg" disabled={pending} className="mt-3">
          <span>Save</span>

          {pending && (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              aria-hidden={true}
              className="ml-2 align-baseline"
            >
              <span className="sr-only">Sending...</span>
            </Spinner>
          )}
        </Button>
      </Form>
      {organisation &&
        auth.user &&
        organisation.Owner == auth.user.getUsername() && (
          <Form onSubmit={handleSubmit(onInviteSubmit)}>
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
                <Button type="submit" size="lg" className="mb-0">
                  Invite
                </Button>
              </Col>
            </Form.Row>
          </Form>
        )}
    </>
  );
}

export default SettingsOrganisation;
