"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { Message, User } from "@prisma/client";

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

  return (
    <>
    {data.length === 0 && (
      <div className="w-full h-[80vh] flex flex-col items-center justify-center">
        <h1 className="">No Message</h1>
      </div>
    )}
      {data?.map((user: MessageWithSenderOrReceiver, i: number) => {
        return (
          <Fragment key={user.id ?? i}>
            <Link
              href={`/message/chat/${user.id}`}
              className="w-full h-fit flex justify-between items-center hover:bg-slate-100 gap-x-2 py-2 cursor-pointer px-4"
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
