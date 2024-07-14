"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { localStorageDBManager } from "@/lib/localStorageDBManager";
import { useToast } from "@/components/ui/use-toast";
import { Database, Server, User, Key, ArrowRight, ArrowLeft } from "lucide-react";

const FormSchema = z.object({
  type: z.string({
    required_error: "Please select a DB type",
  }),
  host: z.string().min(2, {
    message: "Host must be at least 2 characters.",
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
    mode: "onTouched", // This will trigger validation on blur
  });
  const [fase, setFase] = useState("type");
  const { toast } = useToast();

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

  const fadeInOut = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
              key={fase}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeInOut}
          >
            {fase === "type" && (
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Database className="mr-2" /> Database Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select your current DB type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700">
                              <SelectItem value="postgres">Postgres</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            {fase === "host" && (
                <FormField
                    control={form.control}
                    name="host"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Server className="mr-2" /> Host</FormLabel>
                          <FormControl>
                            <Input placeholder="127.0.0.1" {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            {fase === "port" && (
                <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center"><Key className="mr-2" /> Port</FormLabel>
                          <FormControl>
                            <Input placeholder="1234" {...field} className="bg-gray-800 border-gray-700 text-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            {fase === "final" && (
                <>
                  <FormField
                      control={form.control}
                      name="database"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Database className="mr-2" /> DB Name</FormLabel>
                            <FormControl>
                              <Input placeholder="postgres" {...field} className="bg-gray-800 border-gray-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><User className="mr-2" /> Username</FormLabel>
                            <FormControl>
                              <Input placeholder="root" {...field} className="bg-gray-800 border-gray-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center"><Key className="mr-2" /> Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} className="bg-gray-800 border-gray-700 text-white" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
                </>
            )}
          </motion.div>
          <div className="flex flex-row w-full p-2 justify-between">
            {fase !== "type" && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                      type="button"
                      onClick={() => setFase(fase === "host" ? "type" : fase === "port" ? "host" : "port")}
                      className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </motion.div>
            )}
            {fase !== "final" ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                      type="button"
                      onClick={() => next(fase, fase === "type" ? "host" : fase === "host" ? "port" : "final")}
                      className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
            ) : (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ overflow: "hidden", position: "relative" }}
                >
                  <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white relative z-10 overflow-hidden"
                  >
                    Submit
                    <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ zIndex: -1 }} />
                  </Button>
                </motion.div>
            )}
          </div>
        </form>
      </Form>
  );
}