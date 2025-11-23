import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Card,
  Title,
  Tabs,
  Center,
  Loader,
  Notification,
  Table,
  Button,
} from '@mantine/core';
import axios from 'axios';
import DirectorPrioritiesPanel from './DirectorPrioritiesPanel';
import { directorDashboardRoute } from '../../../routes/academicRoutes';

export default function DirectorDashboard() {
  const [data, setData]           = useState({ pending: [], in_review: [] });
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [selected, setSelected]   = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(directorDashboardRoute, {
        headers: { Authorization: `Token ${token}` },
      });
      setData(res.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <Center style={{ height: 200 }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return <Notification color="red">Error: {error.message}</Notification>;
  }

  const list = data[activeTab];
  const rows = list.map((t) => (
    <tr key={t.id}>
      <td>{t.title}</td>
      <td>
        {new Date(
          activeTab === 'pending'
            ? t.supervisor_approved_at
            : t.director_approved_at
        ).toLocaleDateString()}
      </td>
      <td>
        <Button size="xs" onClick={() => setSelected(t)}>
          {activeTab === 'pending' ? 'Prioritize' : 'View Details'}
        </Button>
      </td>
    </tr>
  ));

  return (
    <Container size="xl" mt="xl">
      <Card shadow="sm" p="lg" withBorder>
        <Title order={3} align="center" mb="md">
          Director Dashboard
        </Title>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="pending">Pending ({data.pending.length})</Tabs.Tab>
            <Tabs.Tab value="in_review">In Review ({data.in_review.length})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="pending" pt="xs">
            <Table highlightOnHover>
              <thead>
                <tr><th>Title</th><th>Approved</th><th>Action</th></tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value="in_review" pt="xs">
            <Table highlightOnHover>
              <thead>
                <tr><th>Title</th><th>Started</th><th>Action</th></tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>

        {selected && (
          <DirectorPrioritiesPanel
            submission={selected}
            readOnly={activeTab !== 'pending'}
            onClose={() => {
              setSelected(null);
              fetchData();
            }}
          />
        )}
      </Card>
    </Container>
  );
}
