import React, { useEffect, useState } from "react";
import {
  Card, Title, TextInput, Textarea,
  Button, LoadingOverlay, Notification, Container,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useParams } from "react-router-dom";
import axios from "axios";
import { reviewDetailRoute } from "../../../routes/academicRoutes";

export default function ProfessorReviewForm() {
  const { token } = useParams();
  const [data, setData]           = useState(null);
  const [score, setScore]         = useState("");
  const [comments, setComments]   = useState("");
  const [loading, setLoading]     = useState(true);
  const [done, setDone]           = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const url = reviewDetailRoute(token);
        const t   = localStorage.getItem("authToken");
        const res = await axios.get(url, { headers: { Authorization: `Token ${t}` } });
        setData(res.data);
      } catch {
        showNotification({ message: "Failed to load form", color: "red" });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  const handleSubmit = async () => {
    try {
      const url = reviewDetailRoute(token);
      const t   = localStorage.getItem("authToken");
      await axios.post(url, { score, comments }, { headers: { Authorization: `Token ${t}` } });
      showNotification({ message: "Review submitted", color: "teal" });
      setDone(true);
    } catch {
      showNotification({ message: "Submission failed", color: "red" });
    }
  };

  if (loading) return <LoadingOverlay visible />;
  if (done)
    return (
      <Container size="sm" mt="xl">
        <Notification color="teal">Thank you for your review!</Notification>
      </Container>
    );

  return (
    <Container size="md" mt="xl">
      <Card shadow="sm" p="lg" withBorder>
        <Title order={3}>{data?.title}</Title>
        <iframe
          src={data?.synopsis_url}
          width="100%" height="300"
          style={{ border: "1px solid #ccc", marginTop: 16 }}
        />
        <iframe
          src={data?.report_url}
          width="100%" height="400"
          style={{ border: "1px solid #ccc", marginTop: 16 }}
        />
        <TextInput
          label="Score"
          type="number"
          required
          value={score}
          onChange={(e) => setScore(e.target.value)}
          mt="md"
        />
        <Textarea
          label="Comments"
          required
          minRows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          mt="md"
        />
        <Button fullWidth mt="md" onClick={handleSubmit}>Submit Review</Button>
      </Card>
    </Container>
  );
}
