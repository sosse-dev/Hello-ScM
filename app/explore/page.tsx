import PostedPhotosOnSearch from "@/page/searchpage/PostedPosts";
import Search from "@/page/searchpage/Search";
function SearchMenu() {
  return (
    <div className="w-full h-full bg-slate-50 overflow-hidden lg:pb-0">
      <Search />
      <div className="h-full w-full flex flex-col overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
        <PostedPhotosOnSearch />
      </div>
    </div>
  );
}

export default SearchMenu;
