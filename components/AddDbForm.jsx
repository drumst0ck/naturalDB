"use client";
import { useState, useEffect } from "react";
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
  Link as LinkIcon,
} from "lucide-react";

const FormSchema = z.object({
  connectionString: z.string().optional(),
  host: z.string().optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  port: z.string().optional(),
  database: z.string().optional(),
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
  const [useConnectionString, setUseConnectionString] = useState(false);

  useEffect(() => {
    form.reset();
  }, [useConnectionString, form]);

  function parseConnectionString(connectionString) {
    try {
      // Remove the protocol if present
      const withoutProtocol = connectionString.replace(
        /^postgres(ql)?:\/\//,
        ""
      );

      // Split the string into credentials and host parts
      const [credentials, hostPart] = withoutProtocol.split("@");

      // Parse credentials
      let username, password;
      if (credentials.includes(":")) {
        [username, password] = credentials.split(":");
      } else {
        username = credentials;
        password = "";
      }

      // Parse host part
      const [hostAndPort, database] = hostPart.split("/");
      const [host, port] = hostAndPort.split(":");

      return {
        host,
        port: port || "5432", // Default to 5432 if no port is specified
        username,
        password,
        database,
        type: "postgres",
      };
    } catch (error) {
      console.error("Error parsing connection string:", error);
      return null;
    }
  }

  async function onSubmit(data) {
    setIsLoading(true);
    let dbData;

    if (useConnectionString) {
      if (!data.connectionString) {
        toast({
          title: "Error",
          description: "Connection string is required",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      dbData = parseConnectionString(data.connectionString);
      if (!dbData) {
        toast({
          title: "Error",
          description: "Invalid connection string",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    } else {
      if (
        !data.host ||
        !data.username ||
        !data.password ||
        !data.port ||
        !data.database
      ) {
        toast({
          title: "Error",
          description: "All fields are required for manual input",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      dbData = { ...data, type: "postgres" };
    }

    try {
      localStorageDBManager.saveToDB(dbData);
      queryClient.invalidateQueries(["databases"]);
      toast({
        title: "Success",
        description: "Your database has been added successfully",
      });
      onClose(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save database: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function next(actual, siguiente) {
    const values = form.getValues();
    let canProceed = true;

    if (useConnectionString) {
      if (actual === "connection" && !values.connectionString) {
        form.setError("connectionString", {
          message: "Connection string is required",
        });
        canProceed = false;
      }
    } else {
      switch (actual) {
        case "connection":
          if (!values.host) {
            form.setError("host", { message: "Host is required" });
            canProceed = false;
          }
          break;
        case "details":
          if (!values.port || !values.database) {
            if (!values.port)
              form.setError("port", { message: "Port is required" });
            if (!values.database)
              form.setError("database", {
                message: "Database name is required",
              });
            canProceed = false;
          }
          break;
        case "credentials":
          if (!values.username || !values.password) {
            if (!values.username)
              form.setError("username", { message: "Username is required" });
            if (!values.password)
              form.setError("password", { message: "Password is required" });
            canProceed = false;
          }
          break;
      }
    }

    if (canProceed) {
      form.clearErrors();
      setFase(siguiente);
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
        onClick={() => onClose(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md text-white font-mono"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#323232] p-2 rounded-t-lg flex items-center mb-4">
            <div className="flex space-x-2">
              <div
                className="w-3 h-3 rounded-full bg-[#ff5f56] cursor-pointer"
                onClick={() => onClose(false)}
                onKeyDown={(e) => e.key === "Enter" && onClose(false)}
                role="button"
                tabIndex={0}
              />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
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
                {fase === "connection" && (
                  <>
                    <h2 className="text-xl mb-4">Connection Method</h2>
                    <div className="flex flex-col space-y-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setUseConnectionString(false)}
                        className={`text-left px-4 py-2 rounded ${
                          !useConnectionString
                            ? "bg-[#2a2a2a] text-[#5ad4e6]"
                            : "bg-transparent text-white"
                        } hover:bg-[#3a3a3a] transition-colors duration-200`}
                      >
                        <span className="text-[#5ad4e6] mr-2">$</span>
                        Manual Input
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseConnectionString(true)}
                        className={`text-left px-4 py-2 rounded ${
                          useConnectionString
                            ? "bg-[#2a2a2a] text-[#5ad4e6]"
                            : "bg-transparent text-white"
                        } hover:bg-[#3a3a3a] transition-colors duration-200`}
                      >
                        <span className="text-[#5ad4e6] mr-2">$</span>
                        Connection String
                      </button>
                    </div>
                    {useConnectionString ? (
                      <FormField
                        control={form.control}
                        name="connectionString"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <LinkIcon className="mr-2" /> Connection String
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="postgresql://user:password@host:port/database"
                                {...field}
                                className="bg-[#2a2a2a] border-gray-700 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
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
                  </>
                )}
                {fase === "details" && !useConnectionString && (
                  <>
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
                              placeholder="5432"
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
                  </>
                )}
                {fase === "credentials" && !useConnectionString && (
                  <>
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
                        fase === "connection"
                          ? "privacy"
                          : fase === "details"
                          ? "connection"
                          : "details"
                      )
                    }
                    className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                )}
                {fase !==
                (useConnectionString ? "connection" : "credentials") ? (
                  <Button
                    type="button"
                    onClick={() =>
                      next(
                        fase,
                        fase === "privacy"
                          ? "connection"
                          : fase === "connection"
                          ? useConnectionString
                            ? "connection"
                            : "details"
                          : "credentials"
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
