"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
    >
      <TableCell className="text-left py-4">
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
      </TableCell>
      <TableCell className="text-center py-4 hidden md:table-cell">
        <span className="px-2 py-1 bg-gray-700 rounded-full text-sm">
          {db.type}
        </span>
      </TableCell>
      <TableCell className="text-center py-4">
        <div className="flex justify-center">
          <StatusIndicator
            isConnected={isConnected}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </TableCell>
      <TableCell className="text-right py-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(db.id)}
          className="text-red-400 hover:text-red-300 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5" />
        </motion.button>
      </TableCell>
    </motion.tr>
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-3xl shadow-lg  mx-auto w-full lg:max-w-[1200px]">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-700">
            <TableHead className="text-left text-gray-400 py-4">
              Database
            </TableHead>
            <TableHead className="text-center text-gray-400 py-4 hidden md:table-cell">
              Type
            </TableHead>
            <TableHead className="text-center text-gray-400 py-4">
              Status
            </TableHead>
            <TableHead className="text-right text-gray-400 py-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {databases && databases.length > 0 ? (
              databases.map((db) => (
                <DbRow key={db.id} db={db} onDelete={handleDelete} />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-8"
                >
                  No databases found
                </TableCell>
              </TableRow>
            )}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export default DbTable;
