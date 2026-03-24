"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { PhotoIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const abortController = new AbortController();
  const [success, setSuccess] = useState("");

  const validateFile = (file: File) => {
    let message = "";
    if (!file.type.startsWith("video") && !file.type.startsWith("image")) {
      message = "Only video and image files are allowed.";
    }
    if (file.size > 100 * 1024 * 1024) {
      message = "File size exceeds the limit of 100MB.";
    }
    return message;
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setError("");
    console.log("STEP 1 - File checking");
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError("Please select a file to upload");
      setIsUploading(false);
      return;
    }
    console.log("STEP 2 - File validation");
    const file = fileInput.files[0];
    const errorMessage = validateFile(file);
    if (errorMessage) {
      setError(errorMessage);
      setIsUploading(false);
      return;
    }
    console.log("STEP 3 - File uploading");

    try {
      const imagekitAuthResp = await await fetch("/api/auth/imagekit-auth");
      if (!imagekitAuthResp.ok) {
        const responseTxt = await imagekitAuthResp.text();
        throw new Error(
          responseTxt || "Failed to get ImageKit auth parameters",
        );
      }
      const imgKitJson = await imagekitAuthResp.json();
      const { signature, expire, token, publicKey } = imgKitJson;
      const uploadResponse = await upload({
        // Authentication parameters
        file,
        fileName: file.name,
        expire,
        token,
        signature,
        publicKey,
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed.
        abortSignal: abortController.signal,
      });
      if (uploadResponse?.fileId) {
        setSuccess("File uploaded successfully!");
      }
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        setError("Upload aborted by the user.");
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError("Invalid request. Please check your file and try again.");
      } else if (error instanceof ImageKitServerError) {
        setError("Server error occurred. Please try again later.");
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError(
          "Network error occurred. Please check your connection and try again.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
      <div>
        <label
          htmlFor="cover-photo"
          className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5 dark:text-white"
        >
          Upload Image
        </label>
        {isUploading && <progress value={progress} max={100}></progress>}
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 dark:border-white/25">
          <div className="text-center">
            <PhotoIcon
              aria-hidden="true"
              className="mx-auto size-12 text-gray-300 dark:text-gray-600"
            />
            <div className="mt-4 flex text-sm/6 text-gray-600 dark:text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500 dark:bg-transparent dark:text-indigo-400 dark:focus-within:outline-indigo-500 dark:hover:text-indigo-300"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="video/*, .mp4, .webm, .ogg, image/*"
                  className="sr-only"
                  onChange={handleUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs/5 text-gray-600 dark:text-gray-400">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
