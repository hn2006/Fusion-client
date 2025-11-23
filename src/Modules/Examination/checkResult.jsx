import React, { useState } from "react";
import {
  Card,
  Paper,
  Text,
  Grid,
  Select,
  Button,
  Loader,
  Center,
  ScrollArea,
  Table,
  Box,
  Alert,
  Title,
} from "@mantine/core";
import axios from "axios";
import { check_result } from "./routes/examinationRoutes";

export default function CheckResult() {
  // Holds the raw JSON string of { no, type }
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [spi, setSpi] = useState(0);
  const [cpi, setCpi] = useState(0);
  const [su, setSu] = useState(0);
  const [tu, setTu] = useState(0);
  const [show, setShow] = useState(false);

  const semesterOptions = [
    { value: JSON.stringify({ no: 1, type: "Odd Semester" }), label: "Semester 1" },
    { value: JSON.stringify({ no: 2, type: "Even Semester" }), label: "Semester 2" },
    { value: JSON.stringify({ no: 3, type: "Summer Semester" }), label: "Summer 1" },
    { value: JSON.stringify({ no: 4, type: "Odd Semester" }), label: "Semester 3" },
    { value: JSON.stringify({ no: 5, type: "Even Semester" }), label: "Semester 4" },
    { value: JSON.stringify({ no: 6, type: "Summer Semester" }), label: "Summer 2" },
    { value: JSON.stringify({ no: 7, type: "Odd Semester" }), label: "Semester 5" },
    { value: JSON.stringify({ no: 8, type: "Even Semester" }), label: "Semester 6" },
    { value: JSON.stringify({ no: 9, type: "Summer Semester" }), label: "Summer 3" },
    { value: JSON.stringify({ no: 10, type: "Odd Semester" }), label: "Semester 7" },
    { value: JSON.stringify({ no: 11, type: "Even Semester" }), label: "Semester 8" },
    { value: JSON.stringify({ no: 12, type: "Summer Semester" }), label: "Summer 4" },
  ];

  const handleSearch = async () => {
    if (!selection) {
      setError("Please select a semester.");
      return;
    }
    setError("");
    setLoading(true);
    setShow(false);

    // Parse our stored JSON
    const { no: semester_no, type: semester_type } = JSON.parse(selection);

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        check_result,
        { semester_no, semester_type },
        { headers: { Authorization: `Token ${token}` } }
      );

      if (!data.success) {
        setError(data.message || "Cannot fetch results.");
      } else {
        setCourses(data.courses);
        setSpi(data.spi);
        setCpi(data.cpi);
        setSu(data.su);
        setTu(data.tu);
        setShow(true);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch result. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const rows = courses.map((c, idx) => (
    <tr key={idx}>
      <td>{c.coursecode}</td>
      <td>{c.coursename}</td>
      <td>{c.credits}</td>
      <td>{c.grade}</td>
    </tr>
  ));

  return (
    <Card withBorder p="lg" radius="md">
      <Paper p="md">
        <Title order={3} mb="md">Check Result</Title>

        {error && <Alert color="red" mb="md">{error}</Alert>}

        <Grid>
          <Grid.Col xs={12} sm={4}>
            <Select
              label="Semester"
              placeholder="Select semester"
              data={semesterOptions}
              value={selection}
              onChange={setSelection}
              required
            />
          </Grid.Col>
        </Grid>

        <Box mt="md">
          <Button onClick={handleSearch} disabled={loading} size="sm">
            View Result
          </Button>
        </Box>

        {loading && (
          <Center mt="lg">
            <Loader size="lg" variant="dots" />
          </Center>
        )}

        {show && !loading && (
          <Box mt="xl">
            <Paper p="md" withBorder mb="md">
              <Title order={4}>
                {/* Display human-readable label again */}
                {semesterOptions.find(o => o.value === selection)?.label}
              </Title>
            </Paper>

            <ScrollArea>
              <Table striped highlightOnHover withColumnBorders>
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Credits</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </ScrollArea>

            <Grid mt="xl">
              {[
                { label: "SPI", value: spi },
                { label: "CPI", value: cpi },
                { label: "SU", value: su },
                { label: "TU", value: tu },
              ].map((stat, i) => (
                <Grid.Col span={3} key={i}>
                  <Paper p="md" withBorder>
                    <Title order={5}>{stat.label}</Title>
                    <Text weight={700} size="xl" mt="md">
                      {stat.value || "N/A"}
                    </Text>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Box>
        )}
      </Paper>
    </Card>
  );
}
