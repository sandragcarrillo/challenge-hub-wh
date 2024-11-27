"use client";


interface QuestCardProps {
  category: string;
  title: string;
  reward?: string;
  isActive: boolean;
  onClick: () => void;
}

export function QuestCard({ category, title, reward, isActive, onClick }: QuestCardProps) {
  return (
    <div
      className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer bg-gradient-to-r from-[#3b38f4] to-[#8988f8]"
      onClick={onClick}
    >
      <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
        <div className="flex justify-between">
          <span className="bg-indigo-600 px-2 py-1 text-white rounded-full">
            {category}
          </span>
          <span
            className={`px-2 py-1 rounded-full ${
              isActive ? "bg-green-600" : "bg-red-600"
            } text-white`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white text-center">{title}</h3>
        <div className="self-end">
          <span className="bg-indigo-600 text-neutral-200 px-2 py-1 rounded-full">
            {reward}
          </span>
        </div>
      </div>
    </div>
  );
}
