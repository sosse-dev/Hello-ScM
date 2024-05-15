import { PropsWithChildren } from "react";

type LayoutFollowProps = PropsWithChildren;

export default function LayoutFollow({ children }: LayoutFollowProps) {
  return (
    <div className="relative w-full h-fit overflow-hidden">{children}</div>
  );
}
