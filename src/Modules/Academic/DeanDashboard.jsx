import React, { useState, useEffect } from "react";
import {
  Card, Title, Tabs, Center, Loader, Button, Text,
} from "@mantine/core";
import axios from "axios";
import FusionTable from "./FusionTable";
import DeanReviewModal from "./DeanReviewModal";
import { deanDashboardRoute } from "../../routes/academicRoutes";

export default function DeanDashboard() {
  const [data, setData] = useState({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sel, setSel] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // required for Tabs

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError(new Error("No token"));
        setLoading(false);
        return;
      }
      const headers = { Authorization: `Token ${token}` };
      try {
        const res = await axios.get(deanDashboardRoute, { headers });
        setData(res.data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading)
    return <Center style={{ height: 200 }}><Loader size="lg" /></Center>;
  if (error)
    return <Text color="red">Error: {error.message}</Text>;

  const cols = ["Student", "Theme", "Action"];
  const makeRows = list =>
    list.map(t => ({
      Student: t.student_name,
      Theme: t.research_theme.slice(0, 30) + "...",
      Action: <Button size="xs" onClick={() => setSel(t)}>Review</Button>
    }));

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Title order={3} mb="md" align="center">Dean Dashboard</Title>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab value="pending">{`Pending (${data.pending.length})`}</Tabs.Tab>
          <Tabs.Tab value="approved">{`Approved (${data.approved.length})`}</Tabs.Tab>
          <Tabs.Tab value="rejected">{`Rejected (${data.rejected.length})`}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="xs">
          <FusionTable columnNames={cols} elements={makeRows(data.pending)} />
        </Tabs.Panel>
        <Tabs.Panel value="approved" pt="xs">
          <FusionTable columnNames={cols} elements={makeRows(data.approved)} />
        </Tabs.Panel>
        <Tabs.Panel value="rejected" pt="xs">
          <FusionTable columnNames={cols} elements={makeRows(data.rejected)} />
        </Tabs.Panel>
      </Tabs>

      {sel && (
        <DeanReviewModal
          thesis={sel}
          onClose={() => setSel(null)}
          refresh={() => window.location.reload()}
        />
      )}
    </Card>
  );
}
