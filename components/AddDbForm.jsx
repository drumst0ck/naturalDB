"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Database,
  Server,
  User,
  Key,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

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

export function AddDbForm({ onClose }) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    mode: "onTouched",
  });
  const [fase, setFase] = useState("privacy");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data) {
    setIsLoading(true);
    localStorageDBManager.saveToDB(data);
    queryClient.invalidateQueries(["databases"]);
    toast({
      title: "Your DB has been added with the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify({ ...data, password: "****" }, null, 2)}
          </code>
        </pre>
      ),
    });
    onClose();
    setIsLoading(false);
  }

  function next(actual, siguiente) {
    if (actual === "privacy") {
      setFase(siguiente);
    } else {
      const values = form.getValues();
      if (!values[actual] || form.getFieldState(actual).error) {
        form.setError(actual, { message: "This field is required" });
      } else {
        form.clearErrors(actual);
        setFase(siguiente);
      }
    }
  }

  const fadeInOut = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-[20px]"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md text-white font-mono"
        >
          <div className="bg-[#323232] p-2 rounded-t-lg flex items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                key={fase}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInOut}
              >
                {fase === "privacy" && (
                  <>
                    <h2 className="text-xl mb-4">Privacy Notice</h2>
                    <p className="mb-4">
                      This app is focused on privacy and open-source code. We do
                      not collect any data, and all database information is
                      stored in your local browser storage. The app will never
                      have access to your information or database credentials on
                      our servers.
                    </p>
                  </>
                )}
                {fase === "type" && (
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Database className="mr-2" /> Database Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                              <SelectValue placeholder="Select your current DB type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-[#2a2a2a] border-gray-700">
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
                        <FormLabel className="flex items-center">
                          <Server className="mr-2" /> Host
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="127.0.0.1"
                            {...field}
                            className="bg-[#2a2a2a] border-gray-700 text-white"
                          />
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
                        <FormLabel className="flex items-center">
                          <Key className="mr-2" /> Port
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="1234"
                            {...field}
                            className="bg-[#2a2a2a] border-gray-700 text-white"
                          />
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
                          <FormLabel className="flex items-center">
                            <Database className="mr-2" /> DB Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="postgres"
                              {...field}
                              className="bg-[#2a2a2a] border-gray-700 text-white"
                            />
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
                          <FormLabel className="flex items-center">
                            <User className="mr-2" /> Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="root"
                              {...field}
                              className="bg-[#2a2a2a] border-gray-700 text-white"
                            />
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
                          <FormLabel className="flex items-center">
                            <Key className="mr-2" /> Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              className="bg-[#2a2a2a] border-gray-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </motion.div>
              <div className="flex flex-row w-full justify-between">
                {fase !== "privacy" && (
                  <Button
                    type="button"
                    onClick={() =>
                      setFase(
                        fase === "type"
                          ? "privacy"
                          : fase === "host"
                          ? "type"
                          : fase === "port"
                          ? "host"
                          : "port"
                      )
                    }
                    className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                {fase !== "final" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      next(
                        fase,
                        fase === "privacy"
                          ? "type"
                          : fase === "type"
                          ? "host"
                          : fase === "host"
                          ? "port"
                          : "final"
                      )
                    }
                    className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isLoading ? "Saving..." : "Save Database"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
