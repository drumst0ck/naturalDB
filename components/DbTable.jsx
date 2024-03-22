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
import { useQuery } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import Link from "next/link";

function DbRow({ db }) {
  const { data, isLoading } = useQuery({
    queryKey: [`connection:${db.id}`],
    queryFn: () =>
      fetch("/api/connection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: db.type,
          host: db.host,
          username: db.username,
          port: db.port,
          database: db.database,
          password: db.password,
        }),
      }).then((res) => res.json()),
  });

  function Status() {
    if (isLoading) return <div>Loading...</div>;
    if (data.lc) {
      return (
        <div className="w-full flex justify-center">
          <div className="flex flex-row justify-center rounded-full items-center h-[20px] w-[20px] bg-green-400"></div>
        </div>
      );
    } else {
      return (
        <div className="w-full flex justify-center">
          <div className="flex flex-row justify-center rounded-full items-center h-[20px] w-[20px] bg-red-400"></div>
        </div>
      );
    }
  }

  return (
    <TableRow>
      <TableCell className="text-left">
        <Link className="w-full" href={`/db/${db.id}`}>
          {db.database}
        </Link>
      </TableCell>
      <TableCell className="text-center">
        {" "}
        <Link className="w-full" href={`/db/${db.id}`}>
          {db.type}
        </Link>
      </TableCell>
      <TableCell className="text-center">
        <Status />
      </TableCell>
      <TableCell className="text-right">
        <button
          onClick={() =>
            fetch("/api/database", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: db.id,
              }),
            })
          }
        >
          <Trash />
        </button>
      </TableCell>
    </TableRow>
  );
}

export default function DBTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["database"],
    queryFn: () => fetch("/api/database").then((res) => res.json()),
  });
  if (isLoading) return <div>Loading...</div>;

  return (
    <>
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
          {data.map((db) => {
            return <DbRow key={db.database} db={db} />;
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{data.length}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
}
