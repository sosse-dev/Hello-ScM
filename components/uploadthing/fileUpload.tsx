"use client";
import getCroppedImg from "@/lib/getCroppedImage";
import { useUploadThing } from "@/lib/uploadthing";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import ImageCropDialog from "../crop/react-easy-crop";
import { toast } from "sonner";

export default function FileUpload({
  disabled,
  value,
  onChange,
  endPoint,
}: {
  disabled: boolean;
  value: string;
  onChange: (url?: string) => void;
  endPoint: "profileImage" | "postImage";
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [gambar, setGambar] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const fileType = value?.split(".").pop();

  const { startUpload } = useUploadThing(endPoint, {
    onClientUploadComplete: (res) => {
      onChange(res?.[0].url);
      setLoadingUpload(false);
    },
    onUploadError: (e) => {
      console.log("Error Upload:", e);
      setLoadingUpload(false);
      toast.error("Something went wrong!, perhaps the image is too big");
    },
    onUploadBegin: () => {
      setLoadingUpload(true);
      toast("Wait..");
    },
  });

  // const fileTypes = permittedFileInfo?.config
  //   ? Object.keys(permittedFileInfo?.config)
  //   : [];

  const onCancel = () => {
    onChange("");
    setOpenDialog(false);
  };

  const previewImage = () => {
    const oFReader = new FileReader();
    const imageUrl = (window.URL ? URL : webkitURL)?.createObjectURL(
      // @ts-ignore
      fileInput?.current?.files?.[0]
    );
    console.log("imageUrl, image url yang dipilih dari file!", imageUrl);
    if (imageUrl) {
      setOpenDialog(true);
    }

    onChange(imageUrl);
    setGambar(imageUrl);
  };

  const onCrop = async (imageUrl: string, croppedAreaPixels: any) => {
    setOpenDialog(false);
    const croppedImageUrl: string = (await getCroppedImg(
      imageUrl,
      croppedAreaPixels
    )) as string;

    let file = await fetch(croppedImageUrl)
      .then((r) => r.blob())
      .then(
        (blobFile) => new File([blobFile], "image.jpg", { type: "image/jpg" })
      );

    console.log("File yang telah dikonversikan dari blob jadi file!", file);

    setGambar(croppedImageUrl as string);

    startUpload([file]);
  };

  if (loadingUpload) {
    return (
      <div className="fixed top-[-2rem] left-0 w-full h-[120vh] bg-black bg-opacity-70 grid place-items-center z-[97]">
        <Loader2 size={100} className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      {value && fileType !== "pdf" && (
        <div className="relative mx-auto w-24 h-24">
          <Image src={gambar} fill alt="uploadedImage" />
          <button
            disabled={disabled}
            onClick={() => onChange("")}
            className="absolute top-1 right-1 bg-red-700 rounded-full text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div>
        {openDialog && (
          <ImageCropDialog
            imageUrl={value}
            cropInit={null}
            zoomInit={null}
            onCancel={onCancel}
            openDialog={openDialog}
            onCrop={onCrop}
          />
        )}
        {!value && (
          <input
            id="uploadImage"
            ref={fileInput}
            type="file"
            name="photo-profile"
            onChange={previewImage}
          />
        )}
      </div>
    </>
  );
}
