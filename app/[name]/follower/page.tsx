// "use client";
// import Image from "next/image";
// import Link from "next/link";
// import { Fragment } from "react";
// import ViewLoader from "@/lib/ViewLoader";
// import { Follow, User } from "@prisma/client";
// import { Waves } from "lucide-react";
// import { useFetchFollower } from "@/hooks/action/useFetchFollower";
// import NavbarFollow from "@/components/Navbar/NavbarFollow";
// import LayoutFollow from "@/components/Layout/LayoutFolllow";
// import Loading from "@/components/loader/Loading";

// type FollowerWithUserProfile = Follow & {
//   following: User;
// };

// function Follower() {
//   const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
//     useFetchFollower();

//   return (
//     <LayoutFollow>
//       <NavbarFollow title="Follower" />
//       <div className="h-[100vh] w-full mt-20 flex flex-col space-y-3 px-2 overflow-y-auto pb-20 lg:pb-0">
//         {data?.pages[0]?.data.length === 0 && !isLoading && (
//           <div className="w-full h-full flex flex-col items-center justify-center mb-20">
//             <Waves />
//           </div>
//         )}
//         {isLoading && <Loading />}
//         {data?.pages?.map((externalData, i) => (
//           <Fragment key={i}>
//             {externalData?.data?.map((data: FollowerWithUserProfile) => (
//               <Link
//                 href={`/${data.following.username}`}
//                 key={data.id}
//                 className="h-[7rem] w-full shrink-0 flex px-4 border-2 border-black hover:bg-slate-100 rounded-md"
//               >
//                 <div className="h-full w-[40%] flex space-x-1 md:space-x-3">
//                   <div className="h-full w-fit grid place-items-center">
//                     <div className="w-20 h-20 rounded-full overflow-hidden">
//                       <Image
//                         src={
//                           data.following.image ?? "/default-profile-picture.png"
//                         }
//                         priority
//                         width={80}
//                         height={80}
//                         alt="profile-picture"
//                       />
//                     </div>
//                   </div>
//                   <div className="h-full flex flex-col justify-center">
//                     <h1 className="text-xl">{data.following.name}</h1>
//                     <p className="line-clamp-1">{data.following.desc}</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </Fragment>
//         ))}
//         <ViewLoader
//           fetchNextPage={() => fetchNextPage()}
//           hasNextPage={hasNextPage}
//         />
//         {isFetchingNextPage && (
//           <div className="w-12 h-12 animate-spin m-auto">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-loader-2 w-full h-full"
//             >
//               <path d="M21 12a9 9 0 1 1-6.219-8.56" />
//             </svg>
//           </div>
//         )}
//       </div>
//     </LayoutFollow>
//   );
// }

// export default Follower;
