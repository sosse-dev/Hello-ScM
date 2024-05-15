import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const handleDeletePost = async (
  userId: string,
  router: AppRouterInstance
) => {
  try {
    toast.info("Deleting the post...")
    const res = await fetch(`/api/post/postId/${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      return
    }

    toast.success("Successfully Deleted!")
    router.push("/");
  } catch {
    return;
  }
};
