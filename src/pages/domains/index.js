import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Section from "components/Section";
import OrganisationDomains from "../../components/OrganisationDomains";

import { useAuth } from "util/auth.js";
import { useRouter } from "next/router";
import { requireAuth } from "util/auth.js";
import userService from "../../services/userService";
import domainsSvc from "../../services/domainsService";

function DomainsPage() {
  const router = useRouter();
  const auth = useAuth();

  const [domains, setDomains] = useState([]);
  const [organisation, setOrganisation] = useState({
    name: "Moggies",
    owner: auth.user ? auth.user.getUsername() : "",
  });
  const onDomainNameSubmit = async (data, setFormAlert) => {
    const result = await domainsSvc.create(data.domainName);
    if (result.success) {
      setFormAlert({
        type: "success",
        message: `${data.domainName} was added and pending DNS validation. Click on 'Settings' to see information about DNS record you need to add before validation expiration date is reached.`,
      });
    } else {
      setFormAlert({ type: "error", message: result.error });
    }
    await loadDomains();
    return result.success;
  };

  const handleDeleteDomain = (domain, setFormAlert) => {
    domainsSvc.remove(domain).then((d) => {
      if (d.status === 200) {
        const newDomains = domains.filter(
          (value) =>
            value.OrganisationId === domain.OrganisationId &&
            value.DomainName !== domain.DomainName
        );
        setFormAlert({
          type: "success",
          message: `${domain.DomainName} has been removed from your organisation.`,
        });

        setDomains(newDomains);
      } else {
        setFormAlert({
          type: "error",
          message: `${domain.DomainName} could not be removed.`,
        });
      }
    });
  };

  const loadDomains = async () => {
    try {
      const domains = await domainsSvc.getAll();
      setDomains(domains);
    } catch (err) {
      // console.log("NO DOMAINS DATA ", err);
    }
  };

  useEffect(async () => {
    try {
      const { userData, session } = await userService.getUserData();
      setOrganisation(userData);
      console.log("userData", userData);
    } catch (err) {
      console.log("NO USER DATA ", err);
    }
    await loadDomains();
  }, []);

  return (
    <Section
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
    >
      <Container>
        <OrganisationDomains
          organisation={organisation}
          user={auth.user}
          domains={domains}
          onAddDoamin={onDomainNameSubmit}
          onDelete={handleDeleteDomain}
        />
      </Container>
    </Section>
  );
}

export default requireAuth(DomainsPage);
