import Carousel from "./Carousel";
import { workCategories } from "../data/workCategories";

export default function PopularWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-15 sm:px-8 lg:px-12">
      <div className="mb-15 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Our Popular Works
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Find trusted workers for everyday tasks around you.
        </p>
      </div>

      {/* CATEGORY GRID — each cell is its own category carousel */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {workCategories.map((category) => (
          <div key={category.id} className="flex flex-col items-center text-center">
            <Carousel
              items={category.items}
              baseWidth={250}
              autoplay={true}
              autoplayDelay={10000}
              pauseOnHover={true}
              loop={true}
              round={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}