import FormContainer from "@/components/FormContainer";
import { AddDbForm } from "@/components/AddDbForm";
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <FormContainer>
        <AddDbForm />
      </FormContainer>
    </div>
  );
}
