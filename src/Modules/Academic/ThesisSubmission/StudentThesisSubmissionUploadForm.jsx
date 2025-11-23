import React from "react";
import { useForm } from "@mantine/form";
import { Card, Title, TextInput, FileInput, Button } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { thesisSubmitRoute } from "../../../routes/academicRoutes";

export default function StudentThesisSubmissionUploadForm() {
  const form = useForm({
    initialValues: { synopsis: null, thesis_report: null },
  });

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("synopsis", values.synopsis);
    data.append("thesis_report", values.thesis_report);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(thesisSubmitRoute, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showNotification({ message: "Thesis submitted", color: "teal" });
    } catch {
      showNotification({ message: "Submission failed", color: "red" });
    }
  };

  return (
    <Card shadow="sm" p="lg" withBorder>
      <Title order={3} mb="md">Submit Your Thesis</Title>
      <FileInput
        label="Synopsis (PDF, ≤5MB)"
        accept=".pdf"
        required
        {...form.getInputProps("synopsis")}
        mt="md"
      />
      <FileInput
        label="Thesis Report (PDF, ≤25MB)"
        accept=".pdf"
        required
        {...form.getInputProps("thesis_report")}
        mt="md"
      />
      <Button fullWidth mt="lg" onClick={form.onSubmit(handleSubmit)}>
        Upload Thesis
      </Button>
    </Card>
  );
}
