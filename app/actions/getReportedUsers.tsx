import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client";

export type ReportedUserWithUserProfile = Prisma.ReportGetPayload<{
  include: {
    user: true;
  };
}>;

export default async function getAllReportedUsers() {
  try {
    const reportedUsers = await prisma.report.findMany({
      where: {
        category: "USER",
      },
      include: {
        user: true,
      }
    });

    if (!reportedUsers) {
      return null;
    }

    return reportedUsers;
  } catch (err) {
    return null;
  }
}
