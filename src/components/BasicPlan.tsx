"use client";
import { useRouter } from "next/navigation";
import Buttons from "./UI/Buttons";
import GradientRotatingCircle from "./GradientRotatingCircle";
import { powerXCoin } from "../assets";

interface User {
  id: number;
  name: string;
  description: string;
  image: string;
  bgImage: string;
  link: string;
  launched: boolean;
}

const BasicPlan = () => {
  const router = useRouter();
  
  const users: User[] = [
    {
      id: 1,
      name: "Start Crypto Mining",
      description:
        "Big Opportunity To Earn More Power X daily profit 1.5% to 9%",
      image:
        "https://i.pinimg.com/1200x/cf/4f/82/cf4f82ca805fd96b601ca1bb90f29f02.jpg",
      bgImage:
        "https://i.pinimg.com/1200x/cf/4f/82/cf4f82ca805fd96b601ca1bb90f29f02.jpg",
      link: "/investment",
      launched: true,
    },
    {
      id: 2,
      name: "Big Surprise",
      description:
        "Big Opportunity We Launched In One Months ",
      image:
        "https://i.pinimg.com/1200x/a7/80/72/a780728baa7a7c63708bd8c7316598d6.jpg",
      bgImage:
        "https://i.pinimg.com/736x/f3/9a/ce/f39acee5a2c39a591aaa9057e0c430f1.jpg",
      link: "/investment",
      launched: false,
    },
    {
      id: 3,
      name: "Power X Coin",
      description: "Power X Coin: $1 to $1000 in 1-2 Years!",
      image: "/powerxcoin.jpg",
      bgImage: "/powerxcoin.jpg",
      link: "/",
      launched: false,
    },
  ];

  const handleCardClick = (user: User) => {
    if (user.launched) {
      router.push(user.link);
    }
  };

  const handleButtonClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event from firing
    if (user.launched) {
      router.push(user.link);
    }
  };

  // Function to get button text based on card ID
  const getButtonText = (user: User) => {
    if (user.launched) {
      return "Click Here";
    } else if (user.id === 2) {
      return "Coming Soon In One Month";
    } else {
      return "Coming Soon 5, 6 Months";
    }
  };

  return (
    <div className="py-2 lg:px-4 px-1">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
          {users.map((user) => (
            <div
              key={user.id}
              className={`rounded-xl lg:p-6 p-4 shadow-lg flex flex-col relative overflow-hidden min-h-[200px] ${
                user.launched 
                  ? 'cursor-pointer hover:scale-105 transition-transform duration-300' 
                  : 'cursor-not-allowed'
              }`}
              onClick={() => handleCardClick(user)}
            >
              {/* Animated Rotating Border */}
              <div
                className="absolute -inset-1 rounded-xl animate-spin opacity-70"
                style={{
                  background: "conic-gradient(from 0deg, #7d9efb, #a83bf8, #ff6b6b, #51cf66, #7d9efb)",
                  animationDuration: "8000ms",
                  zIndex: 0,
                }}
              ></div>
              
              {/* Background for content */}
              <div className="absolute inset-0.5 rounded-xl bg-gray-900 z-1"></div>

              {/* Background Image */}
              <div
                className="absolute inset-0 z-2 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url('${user.bgImage}')` }}
              ></div>

              {/* Top Left Corner Effect */}
              <div
                className="absolute -top-6 -left-6 w-16 h-16 rounded-full z-10 animate-spin"
                style={{
                  background: "linear-gradient(45deg, #7d9efb, #a83bf8, #ff6b6b)",
                  animationDuration: "7000ms",
                  filter: "blur(8px)",
                  opacity: "0.6",
                }}
              ></div>

              {/* Bottom Right Corner Effect */}
              <div
                className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full z-10 animate-spin"
                style={{
                  background: "linear-gradient(135deg, #a83bf8, #7d9efb, #51cf66)",
                  animationDuration: "5000ms",
                  filter: "blur(10px)",
                  opacity: "0.5",
                }}
              ></div>

              {/* Additional Floating Element */}
              <div
                className="absolute top-4 -right-6 w-12 h-12 rounded-full z-10 animate-spin"
                style={{
                  background: "linear-gradient(225deg, #ff6b6b, #51cf66, #7d9efb)",
                  animationDuration: "6000ms",
                  filter: "blur(8px)",
                  opacity: "0.4",
                }}
              ></div>

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col">
                <div className="w-full flex-1">
                  <div className="flex gap-x-3 items-center">
                    <div
                      className="w-20 h-20 rounded-full overflow-hidden
                                 shadow-[inset_-3px_-3px_6px_#ffffff,inset_3px_3px_6px_#d1d1d1]"
                    data-aos="fade-up">
                      <GradientRotatingCircle
                        src={user.image}
                        h="full"
                        w="full"
                      />
                    </div>
                    <div className="flex flex-col flex-wrap flex-1"  data-aos="fade-down">
                      <h2 className="text-lg font-bold text-gray-50">
                        {user.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-base text-gray-200 tracking-wider mt-1 line-clamp-2">
                    {user.description}
                  </p>
                </div>

                <div className="mt-4" >
                  <Buttons
                    text={getButtonText(user)}
                    disabled={!user.launched}
                    onClick={(e) => handleButtonClick(user, e)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasicPlan;