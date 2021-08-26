import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "util/auth.js";
import { useForm } from "react-hook-form";
import OrganisationMembers from "components/OrganisationMembers";
import OrganisationDomains from "components/OrganisationDomains";

import userService from "../services/userService";
import domainsSvc from "../services/domainsService";
import { inviteUser } from "../services/cognitoAuth";

function SettingsOrganisation(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);

  const [organisation, setOrganisation] = useState({
    name: "Moggies",
    owner: auth.user ? auth.user.getUsername() : "",
  });

  const [domains, setDomains] = useState([]);
  const [members, setMembers] = useState([
    "stavrev.georgi@gmail.com",
    "georgi@moggies.io",
    "gabriela@moggies.io",
  ]);

  const { register, handleSubmit, errors } = useForm();

  const onDomainNameSubmit = async (data, setFormAlert) => {
    const result = await domainsSvc.create(data.domainName);
    if (result.success) {
      setFormAlert({
        type: "success",
        message: `${data.domainName} was added and pending validation.`,
      });
    } else {
      setFormAlert({ type: "error", message: result.error });
    }
    await loadDomains();
    return result.success;
  };

  const onInviteSubmit = async (data, setFormAlert) => {
    try {
      await inviteUser(
        data.inviteEmail,
        organisation.Owner,
        organisation.OrganisationId
      );
      setFormAlert({
        type: "success",
        message: `${data.inviteEmail} was invited to join you organisation.`,
      });
    } catch (err) {
      setFormAlert({ type: "error", message: err.message });
    }
  };

  const loadDomains = async () => {
    try {
      const domains = await domainsSvc.getAll();
      setDomains(domains);
    } catch (err) {
      console.log("NO DOMAINS DATA ", err);
    }
  };

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

  useEffect(() => {
    userService
      .getUserData()
      .then(({ userData, session }) => {
        setOrganisation(userData);
      })
      .catch((err) => console.log("NO USER DATA ", err));
  }, []);

  useEffect(async () => {
    await loadDomains();
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
      <OrganisationDomains
        organisation={organisation}
        user={auth.user}
        domains={domains}
        onAddDoamin={onDomainNameSubmit}
      />
      <OrganisationMembers
        organisation={organisation}
        user={auth.user}
        members={members}
        onInvite={onInviteSubmit}
      />
    </>
  );
}

export default SettingsOrganisation;
