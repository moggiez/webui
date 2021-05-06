import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";
import {
  UserPool,
  getUserByUsername,
  authenticateUser,
} from "../services/auth";

function AuthForm(props) {
  const auth = useAuth();

  const [pending, setPending] = useState(false);
  const { handleSubmit, register, errors, getValues } = useForm();

  const submitHandlersByType = {
    signin: ({ email, pass }) => {
      return authenticateUser(email, pass).then((jwtToken) => {
        props.onAuth(jwtToken);
      });
    },
    signup: ({ email, pass }) => {
      return new Promise((resolve, reject) => {
        UserPool.signUp(email, pass, [], null, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }).then((data) =>
        // Call auth complete handler
        props.onAuth(data)
      );
    },
    confirm: ({}) => {
      return new Promise((resolve, reject) => {
        alert("Confirm!");
        resolve("Great success!");
      }).then((data) =>
        // Call auth complete handler
        props.onAuth(data)
      );
    },
    forgotpass: ({ email }) => {
      return auth.sendPasswordResetEmail(email).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Password reset email sent",
        });
      });
    },
    changepass: ({ pass }) => {
      return auth.confirmPasswordReset(pass).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Your password has been changed",
        });
      });
    },
  };

  // Handle form submission
  const onSubmit = ({ email, pass }) => {
    // Show pending indicator
    setPending(true);

    // Call submit handler for auth type
    submitHandlersByType[props.type]({
      email,
      pass,
    }).catch((error) => {
      setPending(false);
      // Show error alert message
      props.onFormAlert({
        type: "error",
        message: error.message,
      });
    });
  };

  useEffect(() => {
    if (props.type == "confirm") {
      new Promise((resolve, reject) => {
        const urlParams = new URLSearchParams(window.location.search);
        getUserByUsername(urlParams.get("user_name")).confirmRegistration(
          urlParams.get("confirmation_code"),
          true,
          (err, data) => {
            if (err) {
              console.log("Confirmaation error: " + JSON.stringify(err));
              reject(err);
            } else {
              console.log("Successful confirmation: " + data);
              resolve(data);
            }
          }
        );
      }).then(() => props.onConfirmation());
    }
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {["signup", "signin", "forgotpass"].includes(props.type) && (
        <Form.Group controlId="formEmail">
          <FormField
            size="lg"
            name="email"
            type="email"
            placeholder="Email"
            error={errors.email}
            inputRef={register({
              required: "Please enter an email",
            })}
          />
        </Form.Group>
      )}

      {["signup", "signin", "changepass"].includes(props.type) && (
        <Form.Group controlId="formPassword">
          <FormField
            size="lg"
            name="pass"
            type="password"
            placeholder="Password"
            error={errors.pass}
            inputRef={register({
              required: "Please enter a password",
            })}
          />
        </Form.Group>
      )}

      {["signup", "changepass"].includes(props.type) && (
        <Form.Group controlId="formConfirmPass">
          <FormField
            size="lg"
            name="confirmPass"
            type="password"
            placeholder="Confirm Password"
            error={errors.confirmPass}
            inputRef={register({
              required: "Please enter your password again",
              validate: (value) => {
                if (value === getValues().pass) {
                  return true;
                } else {
                  return "This doesn't match your password";
                }
              },
            })}
          />
        </Form.Group>
      )}

      <Button
        variant="primary"
        block={true}
        size="lg"
        type="submit"
        disabled={pending}
      >
        {!pending && <span>{props.typeValues.buttonText}</span>}

        {pending && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-hidden={true}
            className="align-baseline"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </Button>
    </Form>
  );
}

export default AuthForm;
