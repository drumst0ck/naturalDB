"use client";
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
import { AddDbForm } from "./AddDbForm";
import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
export default function FormContainer({ children }) {
  const [open, setOpen] = useState(false);
  if (!isMobile) {
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
            <AddDbForm activador={setOpen} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (isMobile) {
    return (
      <Drawer className="w-full p-5" open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Add new database</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add new database</DrawerTitle>
            <DrawerDescription>Add your DB</DrawerDescription>
          </DrawerHeader>
          <AddDbForm activador={setOpen} />
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
}
