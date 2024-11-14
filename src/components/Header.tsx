import { FaPlus } from "react-icons/fa";

export default function Header({ setNewIssueModalOpen }: any) {
  const handleOpenModal = () => {
    setNewIssueModalOpen(true); // Set modal state to true to open the modal
  };
  return (
    <>
      <div className="flex w-full bg-black h-16 text-white items-center">
        <p className="font-black text-2xl tracking-widest text-green-600 ml-6">
          {"<Log />"}
        </p>
        <button
          onClick={handleOpenModal}
          className="hidden md:flex absolute flex-row  items-center right-3 text-md bg-[#0D1117] px-3 py-1 text-green-600 border border-[#0D1117] hover:border-green-600"
        >
          <FaPlus className="text-[8px] mr-1" /> {"new log"}
        </button>
      </div>
    </>
  );
}
