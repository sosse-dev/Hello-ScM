import BackButton from "../button/BackButton";

export default function NavbarFollow({ title }: { title: string }) {
  return (
    <div className="absolute h-[4rem] w-full mb-2 grid place-items-center border-b-2 border-black">
      <BackButton />
      <h1 className="text-xl">{title}</h1>
    </div>
  );
}
