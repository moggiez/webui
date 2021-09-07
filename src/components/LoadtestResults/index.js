import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Chart from "react-google-charts";
import Container from "react-bootstrap/Container";
import Link from "next/link";

import metricsSvc from "../../services/metricsService";
import loadtestSvc from "../../services/loadtestService";

function LoadtestResults({ id }) {
  const [responseTimeData, setResponseTimeData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [dataSource, setDataSource] = useState("N/A");
  const [loadtest, setLoadtest] = useState(null);

  const handleRefresh = () => {
    setRefreshEnabled(false);
    loadMetricsData(id)
      .then(({ data, source }) => {
        setResponseTimeData(data);
        setDataSource(source);
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
              const metricsDataSource = metricsDataResponse.data.Source;
              const r = metricsData[0];
              const arr = [["x", `Loadtest: ${loadtestId}`]];
              for (var i = 0; i < r.Values.length; i++) {
                arr.push([r.Timestamps[i], r.Values[i]]);
              }

              return resolve({ data: arr, source: metricsDataSource });
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

  useEffect(async () => {
    if (id) {
      try {
        const { data, source } = await loadMetricsData(id);
        setResponseTimeData(data);
        setDataSource(source);
        setShowChart(true);
      } catch (err) {
        console.log(err);
      }
      const loadtest = await loadtestSvc.get(id);
      setLoadtest(loadtest);
    }
  }, [id]);

  return (
    <Container>
      {!responseTimeData && <div>Loading data...</div>}
      {responseTimeData && (
        <Row>
          <Col>
            <Chart
              width={"800px"}
              height={"400px"}
              chartType="LineChart"
              loader={<div>Loading chart...</div>}
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
          <Col>
            <Row>
              <Col xs={2} md={2} lg={2}>
                <strong>Playbook:</strong>
              </Col>
              <Col xs={10} md={10} lg={10}>
                {!loadtest && <span>loading...</span>}
                {loadtest && (
                  <Link href={`/playbooks/${loadtest.PlaybookId}`}>link</Link>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={2} md={2} lg={2}>
                <strong>Job Id:</strong>
              </Col>
              <Col xs={10} md={10} lg={10}>
                {!loadtest && <span>loading...</span>}
                {loadtest && <>{loadtest.JobId}</>}
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default LoadtestResults;
