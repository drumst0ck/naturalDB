import FormContainer from "@/components/FormContainer";
import { AddDbForm } from "@/components/AddDbForm";
import { Suspense } from "react";
import DBTable from "@/components/DbTable";

export default async function Dashboard() {
  return (
    <>
      <Suspense
        fallback={
          <div className="flex flex-row justify-center min-h-[90vh] items-start w-full p-2">
            Loading...
          </div>
        }
      >
        <div className="flex flex-row justify-center min-h-[90vh] items-start w-full p-2">
          <div className="flex flex-col w-full max-w-[900px]">
            <div className="flex flex-row w-full justify-start mt-4">
              <FormContainer>
                <AddDbForm />
              </FormContainer>
            </div>
            <div className="flex flex-row w-full justify-center mt-4">
              <div className="flex flex-col max-w-[900px] w-full items-center">
                <DBTable />
              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  );
}
