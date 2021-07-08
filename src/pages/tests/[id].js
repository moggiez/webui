import React, { useState, useEffect } from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoadtestResults from "../../components/LoadtestResults";
import LoadtestList from "../../components/LoadtestList";

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
      {router.query.id != "all" && <LoadtestResults id={router.query.id} />}
      {router.query.id == "all" && <LoadtestList />}
    </Section>
  );
}

export default requireAuth(LoadtestPage);
