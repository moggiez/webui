import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";
import { getUserAttributes } from "services/cognitoAuth";

function SettingsGeneral(props) {
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

  const [userEmail, setUserEmail] = useState();
  useEffect(() => {
    getUserAttributes()
      .then(({ attributes, _ }) => {
        setUserEmail(attributes.filter((v, i) => v.Name == "email")[0].Value);
      })
      .catch((err) => console.log("Error getting user attributes."));
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formName">
        <FormField
          name="name"
          type="text"
          label="Name"
          defaultValue={auth.user ? auth.user.getUsername() : ""}
          disabled
          placeholder="Name"
          error={errors.name}
          size="lg"
          inputRef={register({
            required: "Please enter your name",
          })}
        />
      </Form.Group>
      <Form.Group controlId="formEmail">
        <FormField
          name="email"
          type="email"
          label="Email Address"
          defaultValue={userEmail}
          disabled
          placeholder="Email"
          error={errors.email}
          size="lg"
          inputRef={register({
            required: "Please enter your email",
          })}
        />
      </Form.Group>
      <Button type="submit" size="lg" disabled={pending}>
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

export default SettingsGeneral;
