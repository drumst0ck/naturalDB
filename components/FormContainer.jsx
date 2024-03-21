import { AddDbForm } from "./AddDbForm";
import { isMobile } from "react-device-detect";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
export default function FormContainer({ children }) {
  const [open, setOpen] = useState(false);
  if (isMobile) {
    return (
      <>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new database</DialogTitle>
              <DialogDescription>Add your DB</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (!isMobile) {
  }
}
