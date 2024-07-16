"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Database, Loader2 } from "lucide-react";
import Link from "next/link";
import { localStorageDBManager } from "@/lib/localStorageDBManager";

const checkDatabaseConnection = async (db) => {
  const response = await fetch("/api/check-connection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(db),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.connected;
};

const StatusIndicator = ({ isConnected, isLoading, isError }) => (
  <motion.div
    className={`w-3 h-3 rounded-full ${
      isLoading ? "bg-yellow-400" : isConnected ? "bg-green-400" : "bg-red-400"
    }`}
    animate={{
      boxShadow: [
        "0 0 0 0 rgba(255,255,255,0)",
        "0 0 0 10px rgba(255,255,255,0.1)",
        "0 0 0 20px rgba(255,255,255,0)",
      ],
    }}
    transition={{
      repeat: Infinity,
      duration: 1.5,
    }}
  />
);

const DbRow = ({ db, onDelete }) => {
  const {
    data: isConnected,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dbConnection", db.id],
    queryFn: () => checkDatabaseConnection(db),
  });

  const DatabaseName = () => (
    <div className="flex items-center space-x-2">
      <Database className="h-5 w-5 text-gray-400" />
      <span>{db.database}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between py-2 border-b border-gray-700"
    >
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <Link
            href={`/db/${db.id}`}
            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
          >
            <DatabaseName />
          </Link>
        ) : (
          <span className="text-gray-400">
            <DatabaseName />
          </span>
        )}
        <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
          {db.type}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <StatusIndicator
          isConnected={isConnected}
          isLoading={isLoading}
          isError={isError}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(db.id)}
          className="text-red-400 hover:text-red-300 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const DbTable = () => {
  const queryClient = useQueryClient();

  const { data: databases, isLoading } = useQuery({
    queryKey: ["databases"],
    queryFn: localStorageDBManager.getAllDBs,
    refetchInterval: 1000,
  });

  const handleDelete = (id) => {
    localStorageDBManager.deleteDB(id);
    queryClient.invalidateQueries(["databases"]);
  };

  return (
    <div className="bg-[#1e1e1e] text-white font-mono  flex w-full flex-col rounded-lg overflow-hidden">
      <div className="bg-[#323232] p-2 rounded-t-lg flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div className="flex-grow text-center text-sm">Database List</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          </div>
        ) : (
          <AnimatePresence>
            {databases && databases.length > 0 ? (
              databases.map((db) => (
                <DbRow key={db.id} db={db} onDelete={handleDelete} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No databases found
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default DbTable;
