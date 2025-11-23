import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Table,
  Button,
  Center,
  Loader,
  Title,
  Space,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';

import { rpcSeminarListRoute } from '../../routes/academicRoutes';
import RPCReviewModal from './RPCReviewModal';

export default function RPCDashboardPage() {
  const [pending, setPending]   = useState([]);
  const [approved, setApproved] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [loading, setLoading]   = useState(true);

  const token = localStorage.getItem('authToken');
  const config = { headers: { Authorization: `Token ${token}` } };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(rpcSeminarListRoute, config);
      setPending(res.data.pending || []);
      setApproved(res.data.approved || []);
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response?.data?.detail || 'Failed to load seminar data',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openReview = id => setReviewId(id);
  const closeReview = () => {
    setReviewId(null);
    fetchData();
  };

  const renderRows = (list, isPending) =>
    list.map(s => (
      <tr key={s.id}>
        <td>{s.version}</td>
        <td>{s.thesis}</td>
        <td>{s.student}</td>
        <td>
          <Button size="xs" onClick={() => openReview(s.id)}>
            {isPending ? 'Review' : 'View'}
          </Button>
        </td>
      </tr>
    ));

  if (loading) {
    return (
      <Center style={{ height: 200 }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>RPC Seminar Dashboard</Title>
      <Space h="md" />

      <Tabs defaultValue="pending">
        <Tabs.List>
          <Tabs.Tab value="pending">
            Pending ({pending.length})
          </Tabs.Tab>
          <Tabs.Tab value="approved">
            Approved ({approved.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="xs">
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Ver</th>
                <th>Thesis</th>
                <th>Student</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderRows(pending, true)}</tbody>
          </Table>
        </Tabs.Panel>

        <Tabs.Panel value="approved" pt="xs">
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Ver</th>
                <th>Thesis</th>
                <th>Student</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>{renderRows(approved, false)}</tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>

      {reviewId && (
        <RPCReviewModal seminarId={reviewId} onClose={closeReview} />
      )}
    </Card>
  );
}
