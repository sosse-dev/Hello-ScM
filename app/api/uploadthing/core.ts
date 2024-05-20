import getSession from "@/app/actions/getSession";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getSession();
      if (!session || !session.user.emailVerified) {
        throw new UploadThingError("You need to be logged in to upload image");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(() => {}),

  postImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getSession();
      if (!session || !session.user.emailVerified) {
        throw new UploadThingError("You need to be logged in to upload image");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
