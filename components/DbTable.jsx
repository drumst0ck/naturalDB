"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { localStorageDBManager } from "@/lib/localStorageDBManager";
const checkDatabaseConnection = async (db) => {
  const response = await fetch('/api/check-connection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(db),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.connected;
};
function DbRow({ db, onDelete }) {
  const { data: isConnected, isLoading, isError } = useQuery({
    queryKey: ['dbConnection', db.id],
    queryFn: () => checkDatabaseConnection(db),
    refetchInterval: 30000, // Recheck every 30 seconds
  });
  return (
      <TableRow>
        <TableCell className="text-left">
          <Link className="w-full" href={`/db/${db.id}`}>
            {db.database}
          </Link>
        </TableCell>
        <TableCell className="text-center">
          <Link className="w-full" href={`/db/${db.id}`}>
            {db.type}
          </Link>
        </TableCell>
        <TableCell className="text-center">
          <div className="w-full flex justify-center">
            {isLoading ? (
                <div>Checking...</div>
            ) : isError ? (
                <div className="text-red-500">Error</div>
            ) : (
                <div
                    className={`flex flex-row justify-center rounded-full items-center h-[20px] w-[20px] ${
                        isConnected ? 'bg-green-400' : 'bg-red-400'
                    }`}
                ></div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <button onClick={() => onDelete(db.id)}>
            <Trash />
          </button>
        </TableCell>
      </TableRow>
  );
}

export default function DBTable() {
  const queryClient = useQueryClient();

  const { data: databases, isLoading } = useQuery({
    queryKey: ["databases"],
    queryFn: localStorageDBManager.getAllDBs,
    // Ensure the query updates frequently
    refetchInterval: 1000,
  });

  const handleDelete = (id) => {
    localStorageDBManager.deleteDB(id);
    queryClient.invalidateQueries(["databases"]);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
      <Suspense fallback={<div>Loading...</div>}>
        <Table className="max-w-[800px]">
          <TableCaption>A list of all your databases.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Database</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {databases && databases.length > 0 &&
                databases.map((db) => (
                    <DbRow key={db.id} db={db} onDelete={handleDelete} />
                ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{databases ? databases.length : 0}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Suspense>
  );
}