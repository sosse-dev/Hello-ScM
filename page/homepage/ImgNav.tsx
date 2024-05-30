import getThisUser from "@/app/actions/getThisUserImage";
import Image from "next/image";

async function MainNav() {
  const image = await getThisUser();
  return (
    <div className="w-14 h-14 my-auto rounded-full cursor-pointer overflow-hidden">
      <Image
        src={image ?? "/default-profile-picture.png"}
        width={80}
        height={80}
        className="w-full h-auto object-contain"
        alt="profile-picture"
      />
    </div>
  );
}

export default MainNav;
