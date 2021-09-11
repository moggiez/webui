import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Chart from "react-google-charts";
import Container from "react-bootstrap/Container";
import { Line } from "react-chartjs-2";

import Link from "next/link";

import metricsSvc from "../../services/metricsService";
import loadtestSvc from "../../services/loadtestService";

function LoadtestResults({ id }) {
  const [responseTimeData, setResponseTimeData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [refreshEnabled, setRefreshEnabled] = useState(true);
  const [dataSource, setDataSource] = useState("N/A");
  const [loadtest, setLoadtest] = useState(null);

  const setChartData = (data) => {
    setResponseTimeData(data);
    const timestamps = [];
    const responseTimes = [];
    data.forEach((value, index) => {
      if (index > 0) {
        timestamps.push(value[0]);
        responseTimes.push(value[1]);
      }
    });
    const lcData = {
      labels: timestamps,
      datasets: [
        {
          label: "Response time",
          data: responseTimes,
          fill: false,
          backgroundColor: "#ec5471",
          borderColor: "#ec5471",
          cubicInterpolationMode: "monotone",
          tension: 0.4,
        },
      ],
    };
    setLineChartData(lcData);
  };

  const handleRefresh = () => {
    setRefreshEnabled(false);
    loadMetricsData(id)
      .then(({ data, source }) => {
        setChartData(data);
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
        if (data != responseTimeData) {
          setChartData(data);
        }
        setDataSource(source);
        setShowChart(true);
      } catch (err) {
        console.log(err);
      }
      const loadtest = await loadtestSvc.get(id);
      setLoadtest(loadtest);
    }
  }, [id]);

  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const LineChart = () => (
    <>{responseTimeData && <Line data={lineChartData} options={options} />}</>
  );

  return (
    <Container>
      {!responseTimeData && <div>Loading data...</div>}
      {responseTimeData && (
        <>
          <Row>
            <Row>
              <Col>
                <LineChart />
              </Col>
            </Row>
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
        </>
      )}
    </Container>
  );
}

export default LoadtestResults;
