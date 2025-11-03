import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex-col gap-4 w-full flex items-center justify-center h-screen">
      <div className="w-28 h-28 border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full">
        <Image 
          src="/logo.png" 
          alt="Loading" 
          width={112} 
          height={112}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default Loader;



