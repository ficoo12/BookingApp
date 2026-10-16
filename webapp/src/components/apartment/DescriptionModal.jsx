import { XMarkIcon } from "@heroicons/react/24/solid";

const DescriptionModal = ({ description, onClose }) => {
  return (
    <div className="w-screen h-screen top-0 left-0 right-0 fixed bottom-0 bg-gray-950/60">
      <div className="bg-white  max-w-lg h-fit px-5 py-10 rounded-lg mx-auto mt-20">
        <XMarkIcon onClick={onClose} className="w-10 h-auto"></XMarkIcon>
        <div>
          <p className="text-4xl font-medium">About the apartment</p>
          <p className="mt-5">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
