import FormContainer from "@/components/FormContainer";
import { AddDbForm } from "@/components/AddDbForm";
import { Suspense } from "react";
import DBTable from "@/components/DbTable";
export default async function Dashboard() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
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
      </Suspense>
    </>
  );
}
