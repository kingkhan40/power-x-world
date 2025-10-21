import { MenuItem } from "@/types/header";

export const menuItems: MenuItem[] = [
  {
    id: "store",
    title: "Store",
    href: "/products",
  },
  {
    id: "mac",
    title: "Mac",
    href: "/mac",
    sections: [
      {
        title: "Explore Mac",
        links: [
          {
            text: "Explore All Mac",
            href: "/products?category=mac",
            category: "mac",
          },
          {
            text: "MacBook Pro",
            href: "/products?category=mac&type=pro",
            category: "mac",
          },
          {
            text: "MacBook Air",
            href: "/products?category=mac&type=air",
            category: "mac",
          },
          {
            text: "iMac",
            href: "/products?category=mac&type=imac",
            category: "mac",
          },
          {
            text: "Mac Mini",
            href: "/products?category=mac&type=mini",
            category: "mac",
          },
          {
            text: "M3 Models",
            href: "/products?category=mac&series=m3",
            category: "mac",
          },
          {
            text: "M2 Models",
            href: "/products?category=mac&series=m2",
            category: "mac",
          },
        ],
      },
      {
        title: "Shop Mac",
        links: [
          {
            text: "Shop Mac",
            href: "/products?category=mac",
            category: "mac",
          },
          {
            text: "Help Me Choose",
            href: "/products?category=mac&filter=help",
            category: "mac",
          },
          {
            text: "Mac Accessories",
            href: "/products?category=accessories&type=mac",
            category: "accessories",
          },
          {
            text: "Compare Mac Models",
            href: "/products?category=mac&filter=compare",
            category: "mac",
          },
        ],
      },
      {
        title: "More from Mac",
        links: [
          {
            text: "Mac Support",
            href: "/products?category=mac",
            external: true,
          },
          {
            text: "AppleCare+ for Mac",
            href: "/products?category=mac",
            external: true,
          },
          {
            text: "Apple Intelligence",
            href: "/products?category=mac",
            external: true,
          },
          {
            text: "Apps by Apple",
            href: "/products?category=mac",
            external: true,
          },
          {
            text: "Continuity",
            href: "/products?category=mac",
            external: true,
          },
          {
            text: "iCloud+",
            href: "/products?category=mac",
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: "ipad",
    title: "iPad",
    href: "/ipad",
    sections: [
      {
        title: "Explore iPad",
        links: [
          {
            text: "Explore All iPads",
            href: "/products?category=ipad",
            category: "ipad",
          },
          {
            text: "iPad Pro",
            href: "/products?category=ipad&type=pro",
            category: "ipad",
          },
          {
            text: "iPad Air",
            href: "/products?category=ipad&type=air",
            category: "ipad",
          },
          {
            text: "iPad Mini",
            href: "/products?category=ipad&type=mini",
            category: "ipad",
          },
          {
            text: "iPad Standard",
            href: "/products?category=ipad&type=standard",
            category: "ipad",
          },
          {
            text: "Cellular Models",
            href: "/products?category=ipad&series=cellular",
            category: "ipad",
          },
          {
            text: "M2 Chip iPads",
            href: "/products?category=ipad&series=m2",
            category: "ipad",
          },
          {
            text: "M1 Chip iPads",
            href: "/products?category=ipad&series=m1",
            category: "ipad",
          },
        ],
      },
      {
        title: "Shop iPad",
        links: [
          {
            text: "Shop iPad",
            href: "/products?category=ipad",
            category: "ipad",
          },
          {
            text: "Help Me Choose",
            href: "/products?category=ipad&filter=help",
            category: "ipad",
          },
          {
            text: "iPad Accessories",
            href: "/products?category=accessories&type=ipad",
            category: "accessories",
          },
          {
            text: "Apple Pencil",
            href: "/products?category=accessories&type=pencil",
            category: "accessories",
          },
        ],
      },

      {
        title: "More from iPad",
        links: [
          {
            text: "iPad Support",
            href: "/products?category=ipad",
            external: true,
          },
          {
            text: "AppleCare+ for iPad",
            href: "/products?category=ipad",
            external: true,
          },
          {
            text: "Apple Intelligence",
            href: "/products?category=ipad",
            external: true,
          },
          {
            text: "Apple by Apple",
            href: "/products?category=ipad",
            external: true,
          },
          { text: "iCloud+", href: "#" },
        ],
      },
    ],
  },
 {
  id: "iphone",
  title: "iPhone",
  href: "/iphone",
  sections: [
    {
      title: "Explore iPhone",
      links: [
        {
          text: "Explore All iPhone",
          href: "/products?category=iphone",
          category: "iphone",
        },
        {
          text: "iPhone 17 Pro Max",
          href: "/products?category=iphone&series=17-pro-max",
          category: "iphone",
        },
        {
          text: "iPhone 17 Pro",
          href: "/products?category=iphone&series=17-pro",
          category: "iphone",
        },
        {
          text: "iPhone 17",
          href: "/products?category=iphone&series=17",
          category: "iphone",
        },
        {
          text: "iPhone 16 Pro Max",
          href: "/products?category=iphone&series=16-pro-max",
          category: "iphone",
        },
        {
          text: "iPhone 16 Pro",
          href: "/products?category=iphone&series=16-pro",
          category: "iphone",
        },
        {
          text: "iPhone 16",
          href: "/products?category=iphone&series=16",
          category: "iphone",
        },
        {
          text: "iPhone 15 Pro Max",
          href: "/products?category=iphone&series=15-pro-max",
          category: "iphone",
        },
        {
          text: "iPhone 15 Pro",
          href: "/products?category=iphone&series=15-pro",
          category: "iphone",
        },
        {
          text: "iPhone 15",
          href: "/products?category=iphone&series=15",
          category: "iphone",
        },
       
      ],
    },
    {
      title: "Shop iPhone",
      links: [
         {
          text: "iPhone 14 Pro Max",
          href: "/products?category=iphone&series=14-pro-max",
          category: "iphone",
        },
        {
          text: "iPhone 14 Pro",
          href: "/products?category=iphone&series=14-pro",
          category: "iphone",
        },
        {
          text: "iPhone 14",
          href: "/products?category=iphone&series=14",
          category: "iphone",
        },
        {
          text: "iPhone 13 Pro Max",
          href: "/products?category=iphone&series=13-pro-max",
          category: "iphone",
        },
        {
          text: "iPhone 13 Pro",
          href: "/products?category=iphone&series=13-pro",
          category: "iphone",
        },
        {
          text: "iPhone 13",
          href: "/products?category=iphone&series=13",
          category: "iphone",
        },
       
      
       
      ],
    },
    {
      title: "Shop by Series",
      links: [
        
        {
          text: "Pro Max Series",
          href: "/products?category=iphone&tags=pro-max",
          category: "iphone",
        },

        {
          text: "Pro Series",
          href: "/products?category=iphone&tags=pro",
          category: "iphone",
        },
        {
          text: "Standard Series",
          href: "/products?category=iphone&tags=standard",
          category: "iphone",
        },
        {
          text: "Latest Models",
          href: "/products?category=iphone&tags=latest",
          category: "iphone",
        },
        {
          text: "Best Sellers",
          href: "/products?category=iphone&tags=popular",
          category: "iphone",
        },
      ],
    },
   
    
  ],
},
  {
    id: "watch",
    title: "Watch",
    href: "/watch",
    sections: [
      {
        title: "Explore Watch",
        links: [
          {
            text: "Explore All Watches",
            href: "/products?category=watch",
            category: "watch",
          },
          {
            text: "Series 10",
            href: "/products?category=watch&series=series-10",
            category: "watch",
          },
          {
            text: "Series 9",
            href: "/products?category=watch&series=series-9",
            category: "watch",
          },
          {
            text: "Series 8",
            href: "/products?category=watch&series=series-8",
            category: "watch",
          },
          {
            text: "Watch Ultra",
            href: "/products?category=watch&type=ultra",
            category: "watch",
          },
          {
            text: "Watch SE",
            href: "/products?category=watch&type=se",
            category: "watch",
          },
          {
            text: "Cellular Models",
            href: "/products?category=watch&series=cellular",
            category: "watch",
          },
          {
            text: "GPS Models",
            href: "/products?category=watch&series=gps",
            category: "watch",
          },
          {
            text: "Special Editions",
            href: "/products?category=watch",
            category: "watch",
          },
        ],
      },
      {
        title: "Shop Watch",
        links: [
          {
            text: "Shop Watch",
            href: "/products?category=watch",
            category: "watch",
          },
          {
            text: "Help Me Choose",
            href: "/products?category=watch&filter=help",
            category: "watch",
          },
          {
            text: "Watch Accessories",
            href: "/products?category=accessories&type=watch",
            category: "accessories",
          },
          {
            text: "Watch Bands",
            href: "/products?category=accessories&type=bands",
            category: "accessories",
          },
        ],
      },

      {
        title: "More from Watch",
        links: [
          {
            text: "Apple Watch Support",
            href: "/products?category=watch",
            external: true,
          },
          {
            text: "AppleCare+",
            href: "/products?category=watch",
            external: true,
          },
          {
            text: "Apple by Apple",
            href: "/products?category=watch",
            external: true,
          },
          { text: "iCloud+", href: "#" },
        ],
      },
    ],
  },
  {
    id: "airpods",
    title: "AirPods",
    href: "/airpods",
    sections: [
      {
        title: "Explore AirPods",
        links: [
          {
            text: "Explore All AirPods",
            href: "/products?category=airpods",
            category: "airpods",
          },
          {
            text: "AirPods Max",
            href: "/products?category=airpods&type=max",
            category: "airpods",
          },
          {
            text: "AirPods Pro",
            href: "/products?category=airpods&series=pro",
            category: "airpods",
          },
          {
            text: "AirPods Standard",
            href: "/products?category=airpods&filter=standard",
            category: "airpods",
          },
          {
            text: "Special Editions",
            href: "/products?category=airpods&type=special",
            category: "airpods",
          },
        ],
      },
      {
        title: "Shop AirPods",
        links: [
          {
            text: "Shop AirPods",
            href: "/products?category=airpods",
            category: "airpods",
          },
          {
            text: "Compare Models",
            href: "/products?category=airpods&type=compare",
            category: "airpods",
          },
          {
            text: "AirPods Accessories",
            href: "/products?category=accessories&type=airpods",
            category: "accessories",
          },
          {
            text: "Charging Cases",
            href: "/products?category=accessories&type=charging-case",
            category: "accessories",
          },
        ],
      },

      {
        title: "More from AirPods",
        links: [
          {
            text: "AirPods Support",
            href: "/products?category=airpods",
            external: true,
          },
          {
            text: "AppleCare+ for AirPods",
            href: "/products?category=airpods",
            external: true,
          },
          {
            text: "Apple Music",
            href: "/products?category=apple-music",
            external: true,
          },
          { text: "iCloud+", href: "#" },
        ],
      },
    ],
  },
  {
  id: "accessories",
  title: "Accessories",
  href: "/accessories",
  sections: [
    {
      title: "Explore Accessories",
      links: [
        {
          text: "Explore All Accessories",
          href: "/products",
          category: "accessories",
        },
        {
          text: "Mac Accessories",
          href: "/products?category=mac",
          category: "accessories",
        },
        {
          text: "iPad Accessories",
          href: "/products?category=ipad&type=ipad",
          category: "accessories",
        },
        {
          text: "iPhone Accessories",
          href: "/products?category=iphone&type=iphone",
          category: "accessories",
        },
        {
          text: "Watch Accessories",
          href: "/products?category=watch&type=watch",
          category: "accessories",
        },
        {
          text: "AirPods Accessories",
          href: "/products?category=airpods&type=airpods",
          category: "accessories",
        },
        
      ],
    },
    {
      title: "More Accessories",
      links: [
        {
          text: "AirTag",
          href: "/product",
          category: "accessories",
        },
      ],
    },
  ],
},
  {
    id: "about",
    title: "About",
    href: "/about",
  },
];
