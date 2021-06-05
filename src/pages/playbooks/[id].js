import React, { useState, useEffect } from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import LoadtestResults from "../../components/LoadtestResults";
import PlaybookList from "../../components/PlaybookList";

import { useRouter } from "next/router";
import { requireAuth } from "util/auth.js";

function LoadtestPage(props) {
  const router = useRouter();

  return (
    <Section
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
    >
      <Container
        className="mt-5"
        style={{
          maxWidth: "950px",
          overflow: "scroll",
        }}
      >
        {router.query.id != "all" && <LoadtestResults id={router.query.id} />}
        {router.query.id == "all" && <PlaybookList />}
      </Container>
    </Section>
  );
}

export default requireAuth(LoadtestPage);
