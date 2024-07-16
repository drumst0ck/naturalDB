"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddDbForm } from "./AddDbForm";
import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
export default function FormContainer({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new database</DialogTitle>
            <DialogDescription>Add your DB</DialogDescription>
          </DialogHeader>
          <AddDbForm onClose={setOpen} />
        </DialogContent>
      </Dialog>
    </>
  );
}
