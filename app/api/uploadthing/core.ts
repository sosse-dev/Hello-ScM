import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// change it sosse

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 }})
  // .middleware(() => auth())
  .onUploadComplete(() => {}),

  postImage: f({ image: { maxFileSize: "16MB", maxFileCount: 1 }})
  // .middleware(() => auth())
  .onUploadComplete(() => {})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
