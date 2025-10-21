import Image from "next/image";

interface GradientRotatingCircleProps {
  src: string;
  h?: string;
  w?: string;
}

const GradientRotatingCircle: React.FC<GradientRotatingCircleProps> = ({ 
  src, 
  h = "full", 
  w = "full" 
}) => {
  return (
    <div
      className={`relative w-${w} h-${h} rounded-full flex items-center justify-center m-auto`}
    >
      <div
        className="absolute inset-0 rounded-full border-2 animate-spin border-transparent"
        style={{
          animationDuration: '3000ms',
          backgroundImage: "linear-gradient(to bottom, #7d9efb, #a83bf8)",
          WebkitMask:
            "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      ></div>
      <Image 
        src={src} 
        alt="Rotating circle content"
        width={200}
        height={200}
        className={`object-cover lg:object-contain rounded-full`}
      />
    </div>
  );
};

export default GradientRotatingCircle;