import React from "react";
import Section from "components/Section";
import LoadtestResults from "../../components/LoadtestResults";
import LoadtestList from "../../components/LoadtestList";

import { useRouter } from "next/router";
import { requireAuth } from "util/auth.js";

function LoadtestPage() {
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
        <LoadtestResults id={router.query.id} />
      )}
      {router.query.id == "all" && <LoadtestList />}
    </Section>
  );
}

export default requireAuth(LoadtestPage);
