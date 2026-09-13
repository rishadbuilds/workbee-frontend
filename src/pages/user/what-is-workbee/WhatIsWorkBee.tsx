import {
  CheckCircle2,
  Handshake,
  ListPlus,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
  Users,
  WalletCards,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/user/navbar";

export default function WhatIsWorkBee() {
  return (

      <main className="min-h-screen bg-background text-foreground">
        <Navbar/>
      

      {/* What is WorkBee */}
      

      <Separator />

      {/* Why WorkBee */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Why WorkBee?
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Less searching. Less waiting. More getting things done.
          </h2>

          <p className="mt-4 text-muted-foreground">
            WorkBee makes finding and offering local help simple for
            everyone.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Search}
            title="Find local help"
            description="Post your task and connect with workers who are available and ready to help."
          />

          <FeatureCard
            icon={MessageCircle}
            title="Talk directly"
            description="Discuss the task, ask questions, share details, and understand exactly what needs to be done."
          />

          <FeatureCard
            icon={Handshake}
            title="Agree on the work"
            description="Discuss the price and requirements with the worker before the work begins."
          />

          <FeatureCard
            icon={ShieldCheck}
            title="Work with confidence"
            description="See worker information, reviews, and work history before choosing who to work with."
          />

          <FeatureCard
            icon={WalletCards}
            title="Simple payments"
            description="Complete the agreed work and handle payment through the platform."
          />

          <FeatureCard
            icon={Star}
            title="Build trust"
            description="After the work is completed, clients can leave reviews and ratings to help others."
          />
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            How it works
          </Badge>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Getting help is as simple as 4 steps.
          </h2>

          <p className="mt-4 text-muted-foreground">
            No complicated process. Just describe what you need and let
            WorkBee connect you with someone who can help.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StepCard
            step="01"
            icon={ListPlus}
            title="Post your task"
            description="Tell us what you need done. Add a description, location, budget, and any useful details."
          />

          <StepCard
            step="02"
            icon={Users}
            title="Connect with a worker"
            description="Workers who are interested can find your task and connect with you."
          />

          <StepCard
            step="03"
            icon={Handshake}
            title="Discuss & agree"
            description="Talk about the requirements, price, and other details. Choose the worker who fits your needs."
          />

          <StepCard
            step="04"
            icon={CheckCircle2}
            title="Get it done"
            description="The worker completes the task. Finish the payment and leave a review when you're satisfied."
          />
        </div>
      </section>

      <Separator />

      {/* Example */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 lg:px-12">
        <Card className="overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="bg-muted/50 p-8 sm:p-10">
              <Badge className="mb-4">For example</Badge>

              <h2 className="text-3xl font-bold tracking-tight">
                Need help moving a heavy sofa?
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                You don't have the time or equipment to move it yourself.
                Instead of asking around or searching for someone, simply
                post the task on WorkBee.
              </p>
            </div>

            <div className="p-8 sm:p-10">
              <div className="space-y-5">
                <ExampleStep
                  number="1"
                  title="You post the task"
                  description="“I need help moving a sofa from my first-floor apartment.”"
                />

                <ExampleStep
                  number="2"
                  title="A worker connects with you"
                  description="A local worker sees your task and offers to help."
                />

                <ExampleStep
                  number="3"
                  title="You agree on the details"
                  description="You discuss the work and agree on a fair price."
                />

                <ExampleStep
                  number="4"
                  title="The job gets done"
                  description="The worker helps you move the sofa and the task is completed."
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Feature Card                                                               */
/* -------------------------------------------------------------------------- */

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5" />
        </div>

        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Step Card                                                                  */
/* -------------------------------------------------------------------------- */

interface StepCardProps {
  step: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

function StepCard({
  step,
  icon: Icon,
  title,
  description,
}: StepCardProps) {
  return (
    <Card className="relative h-full">
      <CardHeader>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-5 w-5" />
          </div>

          <span className="text-sm font-semibold text-muted-foreground">
            {step}
          </span>
        </div>

        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Example Step                                                               */
/* -------------------------------------------------------------------------- */

interface ExampleStepProps {
  number: string;
  title: string;
  description: string;
}

function ExampleStep({
  number,
  title,
  description,
}: ExampleStepProps) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-background text-sm font-semibold">
        {number}
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}