"use client";
import React, { HTMLInputTypeAttribute, useState } from "react";
import Cropper, { Point } from "react-easy-crop";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

interface ImageCropDialogProps {
  imageUrl: string;
  cropInit: any;
  zoomInit: any;
  openDialog: boolean;
  onCancel: () => void;
  onCrop: (imageUrl: string, croppedAreaPixels: any) => void;
}

type TcroppedArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TcroppedAreaPixel = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const ImageCropDialog = ({
  imageUrl,
  cropInit,
  zoomInit,
  onCancel,
  onCrop,
}: ImageCropDialogProps) => {
  if (zoomInit == null) {
    zoomInit = 1;
  }
  if (cropInit == null) {
    cropInit = { x: 0, y: 0 };
  }

  const [zoom, setZoom] = useState(zoomInit);
  const [crop, setCrop] = useState(cropInit);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<TcroppedAreaPixel | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropComplete = (
    croppedArea: TcroppedArea,
    croppedAreaPixels: TcroppedAreaPixel
  ) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <div className="fixed top-0 left-0 mx-auto m-auto w-full bg-white h-[40rem] flex flex-col items-center justify-center z-[97]">
      <div className="w-full h-[10rem]">
        <Cropper
          image={imageUrl}
          zoom={zoom}
          crop={crop}
          aspect={1 / 1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-full h-[5rem] bg-slate-800 pt-2 gap-y-1 flex flex-col items-center">
        <div className="flex gap-x-2 text-white">
          <Minus />
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onInput={(e) => {
              // @ts-ignore
              onZoomChange((e.target.value));
            }}
            className="slider"
          ></input>
          <Plus />
        </div>
        <div className="mr-8">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={() => onCrop(imageUrl as string, croppedAreaPixels)}>
            Crop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropDialog;
