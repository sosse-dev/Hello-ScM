import { prisma } from "@/lib/prisma"

export default async function getReports() {
  try {
    const reportedUsers = await prisma.report.findMany({
      where: {
        category: "NOT CATEGORIZED",
      },
      select: {
        id: true,
        title: true,
        desc: true,
      },
    });

    if (!reportedUsers) {
      return null;
    }

    return reportedUsers;
  } catch (err) {
    return null;
  }
}
