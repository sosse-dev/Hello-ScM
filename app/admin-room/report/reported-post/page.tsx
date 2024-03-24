import Link from "next/link";
import getAllReportedPosts, {
  ReportedPostWithUserProfile,
} from "@/app/actions/getReportedPosts";
import DeleteReportBtn from "@/components/button/DeleteReportBtn";
import DeletePostBtn from "@/components/button/DeletePostBtn";

async function ReportedPosts() {
  const reportedPosts = await getAllReportedPosts();
  return (
    <div className="flex flex-col overflow-y-auto">
      <div className="w-full h-16 bg-slate-300 grid place-items-center border-b-2 border-black shrink-0">
        <h1 className="font-semibold">Reported Posts list</h1>
      </div>
      {reportedPosts?.map((report: ReportedPostWithUserProfile) => {
        return (
          <div
            key={report?.id}
            className="w-full h-fit px-6 py-3 flex flex-col bg-slate-300 mb-3"
          >
            <h1 className="text-3xl">{report?.title}</h1>
            <p className="">{report?.desc}</p>
            <Link
              href={{
                pathname: "/post",
                query: {
                  id: report?.post?.id,
                },
              }}
              className="w-fit h-fit flex space-x-3 items-center mt-6 rounded-md border-2 border-black hover:border-slate-400 px-3 py-2"
            >
              <div className="w-14 h-14 bg-green-500"></div>
              <h1 className="">{report?.post?.title ?? "{error}"}</h1>
            </Link>
            <div className="flex space-x-3 mt-4">
              <DeleteReportBtn id={report?.id} />
              <DeletePostBtn postId={report?.post?.id as string} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReportedPosts;
