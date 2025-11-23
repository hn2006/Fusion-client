import React, { useState, useEffect } from "react";
import {
  Card,
  Title,
  Tabs,
  Center,
  Loader,
  Button,
  Text,
} from "@mantine/core";
import axios from "axios";
import FusionTable from "./FusionTable";
import SupervisorReviewModal  from "./SupervisorReviewModal";
import {
  supervisorDashboardRoute,
} from "../../routes/academicRoutes";

export default function SupervisorDashboard() {
  const [data, setData] = useState({ pending: [], forwarded: []});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(new Error("No token found"));
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Token ${token}` };
      try {
        const res = await axios.get(supervisorDashboardRoute, { headers });
        setData(res.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Center style={{ height: 200 }}>
        <Loader size="lg" />
      </Center>
    );
  }
  if (error) {
    return <Text color="red">Error: {error.message}</Text>;
  }

  const columnNames = ["Student", "Theme", "Action"];
  const makeRows = (list) =>
    list.map((t) => ({
      Student: t.student_name,
      Theme: t.research_theme,
      Action: (
        <Button size="xs" onClick={() => setSelected(t)}>
          Review
        </Button>
      ),
    }));

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3} mb="md" align="center">
        Supervisor Dashboard
      </Title>

      <Tabs defaultValue="pending">
        <Tabs.List>
          <Tabs.Tab value="pending">Pending ({data.pending.length})</Tabs.Tab>
          <Tabs.Tab value="forwarded">Forwarded ({data.forwarded.length})</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="md">
          <FusionTable columnNames={columnNames} elements={makeRows(data.pending)} />
        </Tabs.Panel>

        <Tabs.Panel value="forwarded" pt="md">
          <FusionTable columnNames={columnNames} elements={makeRows(data.forwarded)} />
        </Tabs.Panel>
      </Tabs>

      {selected && (
        <SupervisorReviewModal
          thesis={selected}
          onClose={() => setSelected(null)}
          refresh={() => window.location.reload()}
        />
      )}
    </Card>
  );
}
