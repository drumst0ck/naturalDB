"use client";
import FormContainer from "@/components/FormContainer";
import { AddDbForm } from "@/components/AddDbForm";
export default function Dashboard() {
  const test = fetch("/api/connection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "postgres",
      host: "157.90.123.33",
      port: 9002,
      username: "postgres",
      password: "L4QysZYDFqN0Kbw2tVPpK1CsHMevhRP3",
      database: "postgres",
    }),
  });
  console.log(test);
  return (
    <div>
      <h1>Dashboard</h1>
      <FormContainer>
        <AddDbForm />
      </FormContainer>
    </div>
  );
}
