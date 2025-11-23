// src/components/thesis/DirectorPrioritiesPanel.jsx

import React, { useState, useEffect } from 'react';
import {
  Card,
  Title,
  Table,
  Select,
  Button,
  Notification,
  Loader,
  Group,
} from '@mantine/core';
import axios from 'axios';
import { directorApproveRoute } from '../../../routes/academicRoutes';

export default function DirectorPrioritiesPanel({
  submission,
  readOnly = false,
  onClose,
}) {
  const [prioMap, setPrioMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    const init = {};
    submission.invitations.forEach((inv) => {
      init[inv.token] = inv.priority || 1;
    });
    setPrioMap(init);
    setLoading(false);
  }, [submission]);

  const handleChange = (token, value) => {
    setPrioMap((m) => ({ ...m, [token]: Number(value) }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        submission_id: submission.id,
        priorities: submission.invitations.map((inv) => ({
          token: inv.token,
          priority: prioMap[inv.token],
        })),
      };
      const token = localStorage.getItem('authToken');
      await axios.post(directorApproveRoute, payload, {
        headers: { Authorization: `Token ${token}` },
      });
      onClose();
    } catch {
      setError('Failed to save priorities');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Notification color="red">{error}</Notification>;

  return (
    <Card shadow="xs" p="md" mt="lg" withBorder>
      <Title order={4} mb="md">
        {readOnly ? `Priorities for "${submission.title}"` : `Set Priorities for "${submission.title}"`}
      </Title>

      <Table>
        <thead>
          <tr><th>Examiner</th><th>Email</th><th>Priority</th><th>{!readOnly && ' '}</th></tr>
        </thead>
        <tbody>
          {submission.invitations.map((inv) => (
            <tr key={inv.token}>
              <td>{inv.prof_name}</td>
              <td>{inv.prof_email}</td>
              <td>
                <Select
                  data={submission.invitations.map((_, i) => ({
                    value: String(i + 1),
                    label: String(i + 1),
                  }))}
                  value={String(prioMap[inv.token])}
                  onChange={(v) => handleChange(inv.token, v)}
                  disabled={readOnly}
                />
              </td>
              {!readOnly && <td />}
            </tr>
          ))}
        </tbody>
      </Table>

      <Group position="right" mt="md">
        <Button variant="default" onClick={onClose}>
          {readOnly ? 'Close' : 'Cancel'}
        </Button>
        {!readOnly && (
          <Button onClick={handleSave}>
            Save Priorities
          </Button>
        )}
      </Group>
    </Card>
  );
}
