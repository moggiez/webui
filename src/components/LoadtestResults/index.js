import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Chart from "react-google-charts";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import metricsSvc from "../../services/metricsService";

function LoadtestResults(props) {
  const [responseTimeData, setResponseTimeData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [dataSource, setDataSource] = useState("N/A");

  const handleRefresh = () => {
    setRefreshEnabled(false);
    loadMetricsData(props.id)
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

  useEffect(() => {
    if (props.id) {
      loadMetricsData(props.id)
        .then(({ data, source }) => {
          setResponseTimeData(data);
          setDataSource(source);
          setShowChart(true);
        })
        .catch((err) => console.log(err));
    }
  }, [props.id]);

  return (
    <Container>
      <Row>
        <Col>Source: {dataSource} </Col>
      </Row>
      <Row>
        {!showChart && <div>Loading...</div>}
        {refreshEnabled
          ? showChart && (
              <Button
                variant="primary"
                onClick={handleRefresh}
                className="mt-3"
              >
                Refresh
              </Button>
            )
          : showChart && (
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
    </Container>
  );
}

export default LoadtestResults;
