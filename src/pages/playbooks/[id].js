import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Playbook from "../../components/Playbook";
import PlaybookList from "../../components/PlaybookList";

import { useRouter } from "next/router";
import { requireAuth } from "util/auth.js";

function PlaybooksPage(props) {
  const router = useRouter();

  return (
    <Section
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
    >
      {router.query.id && router.query.id != "all" && (
        <Playbook id={router.query.id} />
      )}
      {router.query.id == "all" && <PlaybookList />}
    </Section>
  );
}

export default requireAuth(PlaybooksPage);
