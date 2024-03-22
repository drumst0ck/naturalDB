import FormContainer from "@/components/FormContainer";
import { AddDbForm } from "@/components/AddDbForm";
import { auth } from "@clerk/nextjs";
import DBTable from "@/components/DbTable";
export default async function Dashboard() {
  /*   const { getToken } = auth();
  const token = await getToken({ template: "test" });
  const test = await fetch("http://localhost:3000/api/connection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: "postgres",
      host: "157.90.123.33",
      port: 9002,
      username: "postgres",
      password: "L4QysZYDFqN0Kbw2tVPpK1CsHMevhRP3",
      database: "postgres",
    }),
  })
    .then((res) => res.json())
    .catch((e) => e); */

  return (
    <>
      <div className="flex flex-row justify-center items-center w-full p-2">
        <div className="flex flex-col w-full items-center">
          <FormContainer>
            <AddDbForm />
          </FormContainer>
          <div className="flex flex-row w-full justify-center">
            <div className="flex flex-col max-w-[1200px] w-full items-center">
              <DBTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
