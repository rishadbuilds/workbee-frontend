import type { CarouselItem } from "../components/Carousel";

// carousel one
import FunitureAssemply from "../home-assets/carouselOne/Furniture Assembly.png";
import HeavyAssemply from "../home-assets/carouselOne/heavy-assemply.webp";
import VenueHelp from "../home-assets/carouselOne/venue-work-help.avif";

// carousel two
import MovingsHeaveItems from "../home-assets/carouselTwo/Moving-Heavy-items.webp";
import InHomeReArrange from "../home-assets/carouselTwo/inhome-rearangings.jpg";
import WoodWorkHelper from "../home-assets/carouselTwo/woodwork-helper.jpg";

// carousel three
import DustCleanings from "../home-assets/carouselThree/Dust-cleaings.webp";
import HomeDeepCleanings from "../home-assets/carouselThree/Home-deep-cleanings.jpg";
import VehicleCleanings from "../home-assets/carouselThree/vehicle-cleanings.png";

// carousel four
import WaterTankCleanings from "../home-assets/carouselFour/water-tank-cleanings.webp";
import ClothWashings from "../home-assets/carouselFour/cloth-washings.jpg";
import CarWashings from "../home-assets/carouselFour/car-washings.jpg";

// carousel five
import GroceryDeliver from "../home-assets/carouselFive/Grocery-deliver.webp";
import PersonalPurchase from "../home-assets/carouselFive/personal-purchase.webp";
import PersonalDriver from "../home-assets/carouselSix/personal-driver.webp";

// carousel six
import GeneralPlumpings from "../home-assets/carouselSix/general-plumbing-repair-under-kitchen-sink-with-tools-arranged-around-him-free-photo.jpeg";
import HouseHelper from "../home-assets/carouselSix/house-helper.jpg";
import MechanicalHelpers from "../home-assets/carouselSix/mechanicalhelpers.webp";

export interface WorkCategory {
  id: number;
  title: string;
  description: string;
  items: CarouselItem[];
}

export const workCategories: WorkCategory[] = [
  {
    id: 1,
    title: "Assembly",
    description: "Skilled hands for anything that needs putting together.",
    items: [
      {
        id: 101,
        title: "Furniture Assembly",
        description: "Flat-pack, wardrobes, beds — built and set in place.",
        image: FunitureAssemply,
      },
      {
        id: 102,
        title: "Heavy Equipment & Product Assembly",
        description: "Machinery, gym equipment, and large product setups.",
        image: HeavyAssemply,
      },
      {
        id: 103,
        title: "Wedding, Event & Venue Setup",
        description: "Tables, decor, and staging assembled for your event.",
        image: VenueHelp,
      },
    ],
  },
  {
    id: 2,
    title: "Heavy Lifting & Moving",
    description: "Muscle and know-how for the heavy stuff.",
    items: [
      {
        id: 201,
        title: "Moving Heavy Items & Freight",
        description: "Safe, careful transport of bulky or heavy loads.",
        image: MovingsHeaveItems,
      },
      {
        id: 202,
        title: "In-Home Rearranging",
        description: "Reorganize furniture and rooms without the strain.",
        image: InHomeReArrange,
      },
      {
        id: 203,
        title: "Carpentry & Woodwork Assistance",
        description: "Help with repairs, builds, and woodworking tasks.",
        image: WoodWorkHelper,
      },
    ],
  },
  {
    id: 3,
    title: "Cleaning",
    description: "Deep, thorough cleaning for homes and vehicles.",
    items: [
      {
        id: 301,
        title: "Apartment & Flat Deep Cleaning",
        description: "Top-to-bottom cleaning for your living space.",
        image: DustCleanings,
      },
      {
        id: 302,
        title: "Post-Construction & Move-In/Move-Out Cleaning",
        description: "Dust, debris, and grime cleared before or after a move.",
        image: HomeDeepCleanings,
      },
      {
        id: 303,
        title: "Vehicle Interior & Exterior Cleanings and Washing",
        description: "Full detailing your vehicles",
        image: VehicleCleanings,
      },
    ],
  },
  {
    id: 4,
    title: "Washing & Pressure Washing",
    description: "High-pressure cleaning for surfaces big and small.",
    items: [
      {
        id: 401,
        title: "Laundry & Clothes Washing",
        description: "Washing, drying, and folding handled for you.",
        image: ClothWashings,
      },
      {
        id: 402,
        title: "Water Tank Cleaning",
        description: "Sanitized, sediment-free tanks for clean water.",
        image: WaterTankCleanings,
      },
      {
        id: 403,
        title: "Vehicle & Driveway Power Washing",
        description: "Blast away grime from cars, driveways, and paths.",
        image: CarWashings,
      },
    ],
  },
  {
    id: 5,
    title: "Purchasing & Running Errands",
    description: "Someone to handle the shopping and pickups for you.",
    items: [
      {
        id: 501,
        title: "Grocery Purchasing & Delivery",
        description: "Groceries purchase, picked, packed, and delivered to your door.",
        image: GroceryDeliver,
      },
      {
        id: 502,
        title: "Personal Shopping & Procurement",
        description: "Sourcing and buying items on your behalf.",
        image: PersonalPurchase,
      },
      {
        id: 503,
        title: "Personal Driver",
        description: "A reliable driver whenever you need to get somewhere.",
        image: PersonalDriver,
      },
    ],
  },
  {
    id: 6,
    title: "General Help & Labor",
    description: "Everyday help for tasks around the house.",
    items: [
      {
        id: 601,
        title: "Trades Assistant (Plumber / Mechanic Helper)",
        description: "Extra hands to support plumbers and mechanics on-site.",
        image: MechanicalHelpers,
      },
      {
        id: 602,
        title: "Local Handyman Assistant",
        description: "General repairs and small fixes around your home.",
        image: GeneralPlumpings,
      },
      {
        id: 603,
        title: "House Helper & Daily Chores",
        description: "Support with everyday chores around the house.",
        image: HouseHelper,
      },
    ],
  },
];