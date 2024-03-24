import getAllUser from "@/app/actions/getAllUsers";
import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";
import DeleteUserBtn from "@/components/button/DeleteUserBtn";

async function AdminUserRoom() {
  const users = await getAllUser();
  return (
    <div className="w-full flex flex-col items-center gap-y-2 overflow-y-auto pb-3">
      <div className="w-full h-16 bg-slate-300 grid place-items-center border-b-2 border-black shrink-0">
        <h1 className="font-semibold">Users list</h1>
      </div>
      {users?.map((data: User) => {
        return (
          <Link
            key={data?.id}
            href={`/${data?.username}`}
            className="w-full lg:w-[80%] h-20 bg-slate-300 flex justify-between items-center px-5 shrink-0"
          >
            <div className="w-fit h-fit flex items-center gap-x-2">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={data?.image ?? "/default-profile-picture.png"}
                  width={80}
                  height={80}
                  alt="profile-picture"
                />
              </div>
              <h1 className="text-2xl">{data?.name}</h1>
            </div>
            <div className="flex space-x-2">
              <DeleteUserBtn userId={data.id as string} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default AdminUserRoom;
