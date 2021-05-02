import React from "react";
import HeroSection2 from "components/HeroSection2";
import TeamBiosSection from "components/TeamBiosSection";

function AboutPage(props) {
  return (
    <>
      <HeroSection2
        bg="primary"
        textColor="white"
        size="lg"
        bgImage="/images/scale.jpg"
        bgImageOpacity={0.9}
        title="We help you scale"
        subtitle="Our cloud-native solution will enable your website and API to scale fast and safely in line with your company's (hyper)growth."
      />
      <TeamBiosSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Meet the Team"
        subtitle=""
      />
    </>
  );
}

export default AboutPage;
