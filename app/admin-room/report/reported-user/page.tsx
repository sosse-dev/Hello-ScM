import Link from "next/link";
import getAllReportedUsers, {
  ReportedUserWithUserProfile,
} from "@/app/actions/getReportedUsers";
import Image from "next/image";
import DeleteUserBtn from "@/components/button/DeleteUserBtn";
import DeleteReportBtn from "@/components/button/DeleteReportBtn";

async function ReportedUser() {
  const ReportedUsers = await getAllReportedUsers();
  return (
    <div className="flex flex-col overflow-y-auto">
      <div className="w-full h-16 bg-slate-300 grid place-items-center border-b-2 border-black shrink-0">
        <h1 className="font-semibold">Reported Posts list</h1>
      </div>
      {ReportedUsers?.map((report: ReportedUserWithUserProfile) => {
        return (
          <div
            key={report?.id}
            className="w-full h-fit px-6 py-3 flex flex-col bg-slate-300 mb-3"
          >
            <h1 className="text-3xl">{report?.title}</h1>
            <p className="">{report?.desc}</p>
            <Link
              href={`/${report?.user?.username}`}
              className="w-fit h-fit flex space-x-3 items-center mt-6 rounded-md border-2 border-black hover:border-slate-400 px-3 py-2"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={report?.user?.image ?? "/default-profile-picture.png"}
                  width={80}
                  height={80}
                  alt="profile-picture"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl">{report?.user?.name ?? "{error}"}</h1>
                <h2 className="">{report?.user?.username ?? "{error}"}</h2>
              </div>
            </Link>
            <div className="flex space-x-3 mt-4">
              <DeleteReportBtn id={report?.id} />
              <DeleteUserBtn userId={report?.user?.id as string} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReportedUser;
