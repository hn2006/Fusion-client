import React, { useEffect, useState } from "react";
import { Card, Title, Notification, Loader, Container } from "@mantine/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import { invitationActionRoute } from "../../../routes/academicRoutes";

export default function AcceptRejectLinks({ action }) {
  const { token } = useParams();
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const run = async () => {
      try {
        const url = invitationActionRoute(token) + action + "/";
        const t = localStorage.getItem("authToken");
        const res = await axios.get(url, { headers: { Authorization: `Token ${t}` } });
        setMsg(res.data.detail);
      } catch {
        setMsg("Error processing link");
      }
    };
    run();
  }, [action, token]);

  if (!msg) return <Loader />;

  return (
    <Container size="sm" mt="xl">
      <Card shadow="sm" p="lg" withBorder>
        <Title order={4}>{action === "accept" ? "Accepted" : "Rejected"}</Title>
        <Notification>{msg}</Notification>
      </Card>
    </Container>
  );
}
