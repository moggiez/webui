import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "components/FeaturesSection.scss";

function FeaturesSection(props) {
  const items = [
    {
      title: "Playbooks",
      description:
        "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
      image: "https://uploads.divjoy.com/undraw-mind_map_cwng.svg",
    },
    {
      title: "Loadtests",
      description:
        "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
      image: "https://uploads.divjoy.com/undraw-personal_settings_kihd.svg",
    },
    {
      title: "Domain protection",
      description:
        "Run loadtests against domains you own. Your domains will be protected, so another customer cannot generate load against them.",
      image: "https://uploads.divjoy.com/undraw-balloons_vxx5.svg",
    },
    {
      title: "Organisations",
      description:
        "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus.",
      image: "https://uploads.divjoy.com/undraw-having_fun_iais.svg",
    },
  ];

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={true}
          className="text-center"
        />
        <div className="FeaturesSection__features">
          {items.map((item, index) => (
            <Row className="align-items-center" key={index}>
              <Col xs={12} lg={6}>
                <SectionHeader
                  title={item.title}
                  subtitle={item.description}
                  spaced={true}
                  size={3}
                  className="text-center text-lg-left"
                />
              </Col>
              <Col>
                <figure className="FeaturesSection__image-container">
                  <Image src={item.image} alt={item.title} fluid={true} />
                </figure>
              </Col>
            </Row>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default FeaturesSection;
