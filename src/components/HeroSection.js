import React, { useRef, useEffect, dangerouslySetInnerHTML } from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SectionHeader from "components/SectionHeader";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import "components/HeroSection.scss";

const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("safari") > -1 && ua.indexOf("chrome") < 0;
};

function HeroSection(props) {
  const videoParentRef = useRef();

  const createVideoTag = () => {
    return {
      __html: `
        <video autoplay loop muted playsinline>
          <source src='${props.video}' type="video/mp4" />
        </video>
      `,
    };
  };

  useEffect(() => {
    if (isSafari() && videoParentRef.current) {
      const player = videoParentRef.current.children[0];

      if (player) {
        player.controls = false;
        player.playsinline = true;
        player.muted = true;
        player.setAttribute("muted", "");
        player.autoplay = true;

        setTimeout(() => {
          const promise = player.play();
          if (promise.then) {
            promise
              .then(() => {})
              .catch(() => {
                videoParentRef.current.style.display = "none";
              });
          }
        }, 0);
      }
    }
  }, []);

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={5} className="text-center text-lg-left">
            <SectionHeader
              title={props.title}
              subtitle={props.subtitle}
              size={1}
              spaced={true}
            />

            <Link href={props.buttonPath} passHref={true}>
              <Button variant={props.buttonColor} size="lg">
                {props.buttonText}
              </Button>
            </Link>
          </Col>
          {/* <Col className="offset-lg-1 mt-5 mt-lg-0 ">
            <figure className="HeroSection__image-container mx-auto">
              <Image src={props.image} fluid={true} />
            </figure>
          </Col> */}
          <Col
            ref={videoParentRef}
            className="col-video"
            dangerouslySetInnerHTML={createVideoTag()}
          />
        </Row>
      </Container>
    </Section>
  );
}

export default HeroSection;
