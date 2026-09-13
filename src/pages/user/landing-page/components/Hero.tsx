import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AuthHelper } from "@/utils/auth-helper";
import { AppRoutes } from "@/constants/routes/app-routes";
import { toast } from "sonner";
import Stack from "@/components/Stack";

import heroOne from "@/assets/hero/hero.moving.one.webp";
import heroTwo from "@/assets/hero/hero.cleaning.two.webp";
import heroThree from "@/assets/hero/hero.three.gardening.webp";
import heroFour from "@/assets/hero/hero.four.furnitureAssemply.jpg";
import heroFive from "@/assets/hero/hero.five.carwash.jpg";
import { CardDescription } from "@/components/ui/card";
import { NeuralButton } from "@/components/ui/neural-button";
import { ArrowUpRight } from "lucide-react";

const heroImages = [heroOne, heroTwo, heroThree, heroFour, heroFive];

export default function Hero() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!AuthHelper.isLoggedIn()) {
      navigate("/login");
      toast.warning("Login first");
    } else {
      navigate(AppRoutes.USER.TASK_BOOKING);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-95px)] w-full max-w-7xl items-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
      <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* LEFT CONTENT */}
        <section className="flex justify-center md:justify-start">
          <div className="w-full max-w-xl text-center md:text-left">
            <h1
              className="
                text-4xl
                font-bold
                leading-[1.08]
                tracking-tight
                text-foreground
                sm:text-5xl
                lg:text-6xl
                xl:text-[4.25rem]
              "
            >
              Assign your Work
              <br />
              to someone in just
              a minute.
            </h1>

            <CardDescription className="mt-5 max-w-lg text-sm font-medium leading-6 text-foreground dark:text-muted-foreground sm:text-base">
              Need something done? Post your task, connect with a local worker,
              agree on a price, and get it done without the hassle.
            </CardDescription>

            <div className="mt-7">
              <NeuralButton onClick={handleNavigate} className="group gap-2 w-32">
                <span>Post work</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </NeuralButton>
            </div>
          </div>
        </section>

        {/* RIGHT IMAGE STACK */}
        <section className="flex w-full justify-center md:justify-end">
          <div
            className="
              relative
              aspect-[470/320]
              w-full
              max-w-[470px]
              sm:max-w-[500px]
              lg:max-w-[520px]
              xl:max-w-[550px]
            "
          >
            <Stack
              randomRotation={false}
              sensitivity={200}
              sendToBackOnClick={true}
              cards={heroImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Work service ${i + 1}`}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ))}
              autoplay={true}
              autoplayDelay={3000}
              pauseOnHover={true}
            />
          </div>
        </section>
      </div>
    </main>
  );
}