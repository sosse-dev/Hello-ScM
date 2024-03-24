"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Message, User } from "@prisma/client";
import OfflinePage from "@/components/OfflinePage";
import { UseCheckConnection } from "@/hooks/UseCheckConnection";

type MessageWithSenderOrReceiver = Message & {
  receiver: User;
  sender: User;
};

type MessageWithReceiver = Message & {
  receiver: User;
};

type MessageWithSender = Message & {
  sender: User;
};

export default function ChattedUser({
  data,
}:
  | MessageWithSenderOrReceiver[]
  | MessageWithReceiver
  | MessageWithSender
  | any) {
  const [isOnline] = UseCheckConnection();

  if (!isOnline) {
    return <OfflinePage />;
  }

  return (
    <>
      {data?.map((user: MessageWithSenderOrReceiver, i: number) => {
        return (
          <Fragment key={user.id ?? i}>
            <Link
              href={`/message/chat/${user.id}`}
              className="w-full h-fit flex justify-between items-center hover:bg-slate-200 border-b-2 border-slate-300 gap-x-2 py-2 cursor-pointer px-4"
            >
              {/* profile and name searched user */}
              <div className="flex items-center gap-x-2">
                <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden">
                  <Image
                    src={
                      user?.sender?.image ??
                      user?.receiver?.image ??
                      "/default-profile-picture.png"
                    }
                    priority={true}
                    width={50}
                    height={50}
                    className="w-full h-auto object-contain"
                    alt="profile-pifture"
                  />
                </div>
                <p className="text-2xl font-semibold break-all">
                  {user?.sender?.name ?? user?.receiver?.name}
                </p>
              </div>
            </Link>
          </Fragment>
        );
      })}
    </>
  );
}
