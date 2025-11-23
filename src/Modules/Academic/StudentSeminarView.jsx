import React, { useState, useEffect } from 'react';
import {
  Card, Title, Table, Center, Loader, Space, Anchor, Text
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { studentSeminarDetailRoute } from '../../routes/academicRoutes';


export default function StudentSeminarView({ id }) {
  const [d, setD] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeminar = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const config = {
          headers: {
            Authorization: `Token ${token}`,
          },
        };
        const res = await axios.get(studentSeminarDetailRoute(id), config);
        setD(res.data);
      } catch (e) {
        const message = e.response?.data?.error || e.message || 'Failed to load seminar details';
        showNotification({ title: 'Error', message, color: 'red' });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSeminar();
  }, [id]);

  if (loading) return <Center><Loader /></Center>;
  if (!d) return null;

  return (
    <Card shadow="sm" padding="lg">
      <Title order={3}>Seminar {d.version} (Read-Only)</Title>
      <Space h="md" />

      <Table striped>
        <tbody>
          <tr><td><Text fw={500}>Date</Text></td><td>{d.date}</td></tr>
          <tr><td><Text fw={500}>Time</Text></td><td>{d.time}</td></tr>
          <tr><td><Text fw={500}>Venue</Text></td><td>{d.venue}</td></tr>
          <tr><td><Text fw={500}>Previous Work</Text></td><td>{d.prev}</td></tr>
          <tr><td><Text fw={500}>Current Contribution</Text></td><td>{d.curr}</td></tr>
          <tr><td><Text fw={500}>Future Plan</Text></td><td>{d.future}</td></tr>
        </tbody>
      </Table>

      <Space h="md" />

      {d.doc_url && (
        <>
          <Title order={5}>PDF Document</Title>
          <Anchor
            href={`http://localhost:8000/${d.doc_url}`}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download PDF
          </Anchor>
        </>
      )}

      <Space h="lg" />
      <Title order={5}>Publications</Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Category</th>
            <th>Submitted</th>
            <th>Accepted</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {d.publications.map(p => (
            <tr key={p.category}>
              <td>{p.category}</td>
              <td>{p.submitted}</td>
              <td>{p.accepted}</td>
              <td>{p.published}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
}
