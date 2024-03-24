import getReports from "@/app/actions/getReports";
import DeleteReportBtn from "@/components/button/DeleteReportBtn";

interface IReport {
  id: string;
  title: string;
  desc: string;
}

async function Report() {
  const reports = await getReports();
  return (
    <div className="w-full flex flex-col items-center overflow-y-auto pb-3">
      <div className="w-full h-16 bg-slate-300 grid place-items-center border-b-2 border-black shrink-0">
        <h1 className="font-semibold">Report list</h1>
      </div>
      {reports?.map((report: IReport) => {
        return (
          <div
            key={report?.id}
            className="w-full h-fit bg-slate-300 px-3 py-2 mb-3"
          >
            <h1 className="text-2xl">{report?.title}</h1>
            <p className="">{report?.desc}</p>
            <div className="flex space-x-3 mt-4">
              <DeleteReportBtn id={report?.id} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Report;
