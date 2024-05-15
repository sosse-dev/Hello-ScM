import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client";

export type ReportedPostWithUserProfile = Prisma.ReportGetPayload<{
  include: {
    post: {
      include: {
        user: true;
      };
    };
  };
}>;

export default async function getAllReportedPosts() {
  try {
    const reportedPosts = await prisma.report.findMany({
      where: {
        category: "POST",
      },
      include: {
        post: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!reportedPosts) {
      return null;
    }

    return reportedPosts;
  } catch (err) {
    return null;
  }
}
