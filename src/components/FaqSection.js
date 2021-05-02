import React, { useState } from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import "components/FaqSection.scss";

function FaqSection(props) {
  // Object to store expanded state for all items
  const [expanded, setExpanded] = useState({});
  // Set an item's expanded state
  const setExpandedItem = (index, isExpanded) => {
    setExpanded({
      ...expanded,
      [index]: isExpanded,
    });
  };

  const items = [
    {
      question: "What is ?",
      answer:
        "Integer ornare neque mauris, ac vulputate lacus venenatis et. Pellentesque ut ultrices purus. Suspendisse ut tincidunt eros. In velit mi, rhoncus dictum neque a, tincidunt lobortis justo.",
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

        {items.map((item, index) => (
          <article
            className="FaqSection__faq-item py-4"
            onClick={() => {
              setExpandedItem(index, !expanded[index]);
            }}
            key={index}
          >
            <h4>
              <span className="text-primary mr-3">
                <i
                  className={
                    "fas" +
                    (expanded[index] ? " fa-minus" : "") +
                    (!expanded[index] ? " fa-plus" : "")
                  }
                />
              </span>
              {item.question}
            </h4>

            {expanded[index] && <div className="mt-3">{item.answer}</div>}
          </article>
        ))}
      </Container>
    </Section>
  );
}

export default FaqSection;
