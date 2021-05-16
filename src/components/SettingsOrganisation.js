import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";
import { ListGroup } from "react-bootstrap";

import userService from "../services/userService";

function SettingsOrganisation(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);

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

  const [organisation, setOrganisation] = useState({
    name: "Moggies",
    owner: auth.user.getUsername(),
  });

  useEffect(() => {
    userService
      .getUserData(auth.user)
      .then(({ userData, session }) => {
        console.log("USER DATA", userData, session);
      })
      .catch((err) => console.log("NO USER DATA ", err));
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formName">
        <FormField
          name="name"
          type="text"
          label="Organisation Name"
          defaultValue={organisation.name}
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
            organisation.owner == auth.user.getUsername() ? "you" : "not you"
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
  );
}

export default SettingsOrganisation;
