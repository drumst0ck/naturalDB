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

export default function DBTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["database"],
    queryFn: () => fetch("/api/database").then((res) => res.json()),
  });
  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  return (
    <>
      <Table>
        <TableCaption>A list of all your databases.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Database</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((db) => (
            <TableRow key={db.database}>
              <TableCell className="font-medium">{db.database}</TableCell>
              <TableCell>{db.type}</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
          ))}
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
