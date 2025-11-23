import React from "react";
import { Table, Select, Text } from "@mantine/core";

export default function RPCCommitteeTable({
  supervisor,
  coSupervisor,
  facultyOptions,
  committee,
  onChange,
  readOnly
}) {
  const fixedMembers = [
    supervisor?.id && { name: supervisor.name, discipline: supervisor.discipline },
    coSupervisor?.id && { name: coSupervisor.name, discipline: coSupervisor.discipline },
  ].filter(Boolean);

  const numSelectables = 5 - fixedMembers.length;

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr><th>Faculty</th><th>Discipline</th></tr>
      </thead>
      <tbody>
        {fixedMembers.map((m, idx) => (
          <tr key={`fixed-${idx}`}>
            <td><Text size="sm">{m.name}</Text></td>
            <td><Text size="sm">{m.discipline}</Text></td>
          </tr>
        ))}
        {Array.from({ length: numSelectables }).map((_, i) => {
          const val = committee[i] || null;
          const label = facultyOptions.find(f => f.value === val)?.label || "";
          const discipline = facultyOptions.find(f => f.value === val)?.discipline || "";
          return (
            <tr key={`select-${i}`}>
              <td>
                {readOnly ? (
                  <Text size="sm">{label || "-"}</Text>
                ) : (
                  <Select
                    data={facultyOptions}
                    value={val}
                    onChange={v => {
                      const updated = [...committee];
                      updated[i] = v;
                      onChange(updated);
                    }}
                    placeholder="Select faculty"
                    clearable
                    size="sm"
                  />
                )}
              </td>
              <td><Text size="sm">{discipline || "-"}</Text></td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
