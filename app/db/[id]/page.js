import { auth } from "@clerk/nextjs";
import { Chat } from "@/components/Chat";
async function generateStaticParams() {
  const { getToken } = auth();
  const token = await getToken({ template: "test" });
  const posts = await fetch(`http://localhost:3000/api/database`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
  return posts.map((post) => ({
    id: post.id,
  }));
}
export default async function Page({ params }) {
  const { getToken } = auth();
  const token = await getToken({ template: "test" });
  const { id } = params;
  const db = await fetch(`http://localhost:3000/api/database?id=${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
  return (
    <>
      <div className="flex flex-row mt-9 justify-center items-center w-full p-2">
        <div className="flex flex-col w-full max-w-[700px] items-center">
          <Chat db={db[0]} />
        </div>
      </div>
    </>
  );
}
