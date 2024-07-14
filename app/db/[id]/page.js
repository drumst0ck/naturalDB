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
      <div className="flex flex-row mt-9 justify-center items-center w-full p-2">
        <div className="flex flex-col w-full max-w-[700px] items-center">
          <Chat id={id} db={db} />
        </div>
      </div>
    </>
  );
}
