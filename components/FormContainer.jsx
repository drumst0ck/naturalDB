"use client";

import { AddDbForm } from "./AddDbForm";
import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
export default function FormContainer({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open ? (
        <>
          <AddDbForm onClose={setOpen} />
        </>
      ) : (
        <>
          <Button onClick={() => setOpen(true)}>
            <Plus />
          </Button>
        </>
      )}
    </>
  );
}
