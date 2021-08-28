import React, { useState, useEffect } from "react";
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
  const [playbookParams, setPlaybookParams] = useState({
    id: null,
    version: null,
  });

  useEffect(() => {
    let segments = [];
    if (router.query && router.query.id) {
      segments = router.query.id.split(":");
    }

    let playbookId = null;
    let playbookVersion = null;
    if (segments.length == 2) {
      playbookId = segments[0];
      playbookVersion = segments[1];
    }
    const newParams = { id: playbookId, version: playbookVersion };
    setPlaybookParams(newParams);
  }, [router.query.id]);

  return (
    <Section
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
    >
      {router.query.id && router.query.id != "all" && (
        <Playbook id={playbookParams.id} version={playbookParams.version} />
      )}
      {router.query.id == "all" && <PlaybookList />}
    </Section>
  );
}

export default requireAuth(PlaybooksPage);
