import React, { useState, useEffect } from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Chart from "react-google-charts";
import Button from "react-bootstrap/Button";

import { useRouter } from "next/router";
import { requireAuth } from "util/auth.js";
import metricsSvc from "../../services/metricsService";

function LoadtestPage(props) {
  const router = useRouter();
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);

  const handleRefresh = () => {
    setRefreshEnabled(false);
    loadMetricsData(router.query.id)
      .then((data) => {
        setResponseTimeData(data);
        setRefreshEnabled(true);
      })
      .catch((err) => console.log(err));
  };

  const loadMetricsData = (loadtestId) => {
    return new Promise((resolve, reject) => {
      if (loadtestId) {
        metricsSvc
          .getMetricsData(loadtestId)
          .then((metricsDataResponse) => {
            try {
              const metricsData = metricsDataResponse.data.MetricDataResults;
              const r = metricsData[0];
              const arr = [["x", `Loadtest: ${loadtestId}`]];
              for (var i = 0; i < r.Values.length; i++) {
                arr.push([r.Timestamps[i], r.Values[i]]);
              }

              return resolve(arr);
            } catch (err) {
              return reject(err);
            }
          })
          .catch((err) => reject("failure metrics data: " + err));
      } else {
        return reject("Missing loadtest id");
      }
    });
  };

  useEffect(() => {
    if (router.query.id) {
      loadMetricsData(router.query.id)
        .then((data) => {
          setResponseTimeData(data);
          setShowChart(true);
        })
        .catch((err) => console.log(err));
    }
  }, [router.query.id]);

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
        }}
      >
        {showChart && (
          <>
            <Row>
              {refreshEnabled ? (
                <Button
                  variant="primary"
                  onClick={handleRefresh}
                  className="mt-3"
                >
                  Refresh
                </Button>
              ) : (
                <Button disabled variant="secondary" className="mt-3">
                  Refreshing...
                </Button>
              )}
            </Row>
            <Row>
              <Col>
                <Chart
                  width={"800px"}
                  height={"400px"}
                  chartType="LineChart"
                  loader={<div>Loading Chart</div>}
                  data={responseTimeData}
                  options={{
                    hAxis: {
                      title: "Date and time",
                    },
                    vAxis: {
                      title: "Response time (ms)",
                    },
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Section>
  );
}

export default requireAuth(LoadtestPage);
