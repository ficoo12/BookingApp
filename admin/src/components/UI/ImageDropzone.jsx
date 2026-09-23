import { useState } from "react";
import { PhotoIcon } from "@heroicons/react/24/outline";

const ImageDropzone = ({ onFiles, maxFileSizeMb = 25 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rejected, setRejected] = useState([]);

  const maxBytes = maxFileSizeMb * 1024 * 1024;

  function handleFiles(fileList) {
    const images = [...fileList].filter((file) =>
      file.type.startsWith("image/")
    );

    setRejected(
      images.filter((file) => file.size > maxBytes).map((file) => file.name)
    );

    const accepted = images.filter((file) => file.size <= maxBytes);
    if (accepted.length > 0) onFiles(accepted);
  }

  function onInputChangeHandler(e) {
    handleFiles(e.target.files);
    e.target.value = "";
  }

  function onDropHandler(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDropHandler}
        className={[
          "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-colors",
          "focus-within:ring-2 focus-within:ring-indigo-500",
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600",
        ].join(" ")}
      >
        <input
          type="file"
          name="pictures"
          accept="image/*"
          multiple
          onChange={onInputChangeHandler}
          className="sr-only"
        />
        <PhotoIcon
          className="size-14 text-gray-300 dark:text-gray-600"
          aria-hidden="true"
        />
        <p className="mt-3 text-gray-700 dark:text-gray-300">
          Drop your image(s) here or{" "}
          <span className="font-medium text-indigo-600 dark:text-indigo-400">
            browse
          </span>
        </p>
        <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
          Max. File Size: {maxFileSizeMb} MB
        </p>
      </label>

      {rejected.length > 0 && (
        <p className="mt-2 text-red-600 dark:text-red-400">
          Larger than {maxFileSizeMb} MB, not added: {rejected.join(", ")}
        </p>
      )}
    </div>
  );
};

export default ImageDropzone;
