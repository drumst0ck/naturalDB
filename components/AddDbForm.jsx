"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { localStorageDBManager } from "@/lib/localStorageDBManager";
import { useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
const FormSchema = z.object({
  type: z.string({
    required_error: "Please select a DB type",
  }),
  host: z.string({
    required_error: "Please add your DB host",
  }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 2 characters.",
  }),
  port: z.string().min(4, {
    message: "Port must be at least 4 characters.",
  }),
  database: z.string({ required_error: "Please add your DB name" }),
});

export function AddDbForm({ activador }) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(FormSchema),
  });
  const [fase, setFase] = useState("type");

  async function onSubmit(data) {
     localStorageDBManager.saveToDB(data);
    queryClient.invalidateQueries(["databases"]);
    toast({
      title: "Your DB has been added with the following values:",
      description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    activador(false);
  }

  function next(actual, siguiente) {
    const values = form.getValues();
    if (!values[actual] || form.getFieldState(actual).error) {
      form.setError(actual, { message: "This field is required" });
    } else {
      form.clearErrors(actual);
      setFase(siguiente);
    }
  }
  return (
    <Form className="w-full max-w-[300px]" {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-5">
        {fase === "type" && (
          <>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your current DB type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="postgres">Postgres</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    More compatibilities are under development
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row w-full p-2 justify-between">
              <Button onClick={() => next("type", "host")}>Next</Button>
            </div>
          </>
        )}
        {fase === "host" && (
          <>
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="127.0.0.1" {...field} />
                  </FormControl>
                  <FormDescription>Please enter your db host.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row w-full p-2 justify-between">
              <Button onClick={() => setFase("type")}>Back</Button>
              <Button onClick={() => next("host", "port")}>Next</Button>
            </div>
          </>
        )}
        {fase === "port" && (
          <>
            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input placeholder="1234" {...field} />
                  </FormControl>
                  <FormDescription>This is your db port.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row w-full p-2 justify-between">
              <Button onClick={() => setFase("host")}>Back</Button>
              <Button onClick={() => next("port", "final")}>Next</Button>
            </div>
          </>
        )}
        {fase === "final" && (
          <>
            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DB Name</FormLabel>
                  <FormControl>
                    <Input placeholder="postgres" {...field} />
                  </FormControl>
                  <FormDescription>This is your db name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="root" {...field} />
                  </FormControl>
                  <FormDescription>This is your db username.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>This is your db password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full block" type="submit">
              Submit
            </Button>
          </>
        )}
      </form>
    </Form>
  );
}
