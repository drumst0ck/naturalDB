"use client";

import { useEffect, useState } from "react";
import { Chat } from "@/components/Chat";
import { localStorageDBManager } from "@/lib/localStorageDBManager";

export default function Page({ params }) {
  const { id } = params;
  const [db, setDb] = useState(null);

  useEffect(() => {
    const dbInfo = localStorageDBManager.getDBById(id);
    setDb(dbInfo);
  }, [id]);

  if (!db) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex  w-full">
        <Chat db={db} id={id} />
      </div>
    </>
  );
}
