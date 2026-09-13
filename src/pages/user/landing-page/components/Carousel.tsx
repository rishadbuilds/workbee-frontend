import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  motion,
  type MotionValue,
  type PanInfo,
  type Transition,
  useMotionValue,
  useTransform,
} from "motion/react";

export interface CarouselItem {
  title: string;
  description: string;
  id: number;
  image?: string;
  icon?: React.ReactNode;
}

export interface CarouselProps {
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: "Text Animations",
    description: "Cool text animations for your projects.",
  },
  {
    id: 2,
    title: "Animations",
    description: "Smooth animations for your projects.",
  },
  {
    id: 3,
    title: "Components",
    description: "Reusable components for your projects.",
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;

// Reduced horizontal space between cards
const GAP = 4;

const SPRING_OPTIONS = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

interface CarouselCardProps {
  item: CarouselItem;
  index: number;
  itemWidth: number;
  round: boolean;
  trackItemOffset: number;
  x: MotionValue<number>;
  transition: Transition;
}

function CarouselCard({
  item,
  index,
  itemWidth,
  round,
  trackItemOffset,
  x,
  transition,
}: CarouselCardProps) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];

  const outputRange = [90, 0, -90];

  const rotateY = useTransform(x, range, outputRange, {
    clamp: false,
  });

  return (
    <motion.div
      key={`${item.id}-${index}`}
      className={`
        relative
        flex
        shrink-0
        cursor-grab
        flex-col
        overflow-hidden
        active:cursor-grabbing
        ${
          round
            ? "items-center justify-center bg-background text-center"
            : "items-start rounded-2xl border border-border bg-card"
        }
      `}
      style={{
        width: itemWidth,
        height: round ? itemWidth : "100%",
        rotateY,
        ...(round && {
          borderRadius: "50%",
        }),
      }}
      transition={transition}
    >
      {item.image && (
        <div className="w-full overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="
              h-32
              w-full
              object-cover
              transition-transform
              duration-700
              hover:scale-105
            "
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-2.5">
        {item.icon && (
          <span className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-muted">
            {item.icon}
          </span>
        )}

        <h3 className="mb-0.5 text-xs font-semibold leading-4 text-foreground">
          {item.title}
        </h3>

        <p className="text-[9px] leading-3.5 text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
}: CarouselProps): React.JSX.Element {
  /*
   * Outer carousel padding.
   * Reduced from 16px to 8px.
   */
  const containerPadding = 8;

  /*
   * Actual card width.
   */
  const itemWidth = baseWidth - containerPadding * 2;

  /*
   * Position of the next card.
   * GAP controls the horizontal space between cards.
   */
  const trackItemOffset = itemWidth + GAP;

  const itemsForRender = useMemo(() => {
    if (!loop) {
      return items;
    }

    if (items.length === 0) {
      return [];
    }

    return [
      items[items.length - 1],
      ...items,
      items[0],
    ];
  }, [items, loop]);

  const [position, setPosition] = useState<number>(
    loop ? 1 : 0,
  );

  const x = useMotionValue(0);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  /*
   * Pause autoplay when hovering.
   */
  useEffect(() => {
    if (!pauseOnHover) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    container.addEventListener(
      "mouseenter",
      handleMouseEnter,
    );

    container.addEventListener(
      "mouseleave",
      handleMouseLeave,
    );

    return () => {
      container.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );

      container.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
    };
  }, [pauseOnHover]);

  /*
   * Autoplay.
   */
  useEffect(() => {
    if (!autoplay || items.length <= 1 || isHovered) {
      return;
    }

    const interval = window.setInterval(() => {
      setPosition((prev) => prev + 1);
    }, autoplayDelay);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    items.length,
  ]);

  /*
   * Reset position when items or loop changes.
   */
  useEffect(() => {
    setPosition(loop ? 1 : 0);
    x.set(0);
  }, [items, loop, trackItemOffset, x]);

  /*
   * Keep position valid for non-loop carousel.
   */
  useEffect(() => {
    if (!loop && items.length > 0) {
      setPosition((prev) =>
        Math.min(prev, items.length - 1),
      );
    }
  }, [items.length, loop]);

  const effectiveTransition: Transition = isJumping
    ? {
        duration: 0,
      }
    : SPRING_OPTIONS;

  /*
   * Handle animation start.
   */
  const handleAnimationStart = () => {
    if (!isJumping) {
      setIsAnimating(true);
    }
  };

  /*
   * Handle animation complete and loop jumps.
   */
  const handleAnimationComplete = () => {
    setIsAnimating(false);

    if (!loop || items.length === 0) {
      return;
    }

    /*
     * We render:
     *
     * [last] [1] [2] [3] [first]
     *
     * If we reach [first], instantly jump to [1].
     */
    if (position === items.length + 1) {
      setIsJumping(true);
      setPosition(1);

      requestAnimationFrame(() => {
        setIsJumping(false);
      });
    }

    /*
     * If we reach [last], instantly jump to [last real item].
     */
    if (position === 0) {
      setIsJumping(true);
      setPosition(items.length);

      requestAnimationFrame(() => {
        setIsJumping(false);
      });
    }
  };

  /*
   * Handle drag.
   */
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const { offset, velocity } = info;

    const offsetX = offset.x;
    const velocityX = velocity.x;

    const shouldMove =
      Math.abs(offsetX) > DRAG_BUFFER ||
      Math.abs(velocityX) > VELOCITY_THRESHOLD;

    if (!shouldMove) {
      return;
    }

    const direction =
      offsetX < 0 || velocityX < 0 ? 1 : -1;

    setPosition((prev) => {
      const next = prev + direction;

      if (loop) {
        return next;
      }

      return Math.max(
        0,
        Math.min(next, items.length - 1),
      );
    });
  };

  /*
   * Drag constraints.
   */
  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -(items.length - 1) * trackItemOffset,
          right: 0,
        },
      };

  const activeIndex = loop
    ? ((position - 1 + items.length) %
        items.length)
    : position;

  return (
    <div
      ref={containerRef}
      className={`
        relative
        overflow-hidden
        p-2
        ${
          round
            ? "rounded-full border border-border"
            : "rounded-[24px] border border-border"
        }
      `}
      style={{
        width: `${baseWidth}px`,
        ...(round && {
          height: `${baseWidth}px`,
        }),
      }}
    >
      <motion.div
        className="flex"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          /*
           * Important:
           * The gap here is only 4px.
           */
          width: "max-content",
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${
            position * trackItemOffset +
            itemWidth / 2
          }px 50%`,
          x,
        }}
        animate={{
          x: -position * trackItemOffset,
        }}
        transition={effectiveTransition}
        onDragEnd={handleDragEnd}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselCard
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            round={round}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
          />
        ))}
      </motion.div>

      {/* Dots */}
      <div
        className={`
          flex w-full justify-center
          ${round ? "absolute bottom-4 left-0" : ""}
        `}
      >
        <div className="mt-3 flex w-[130px] justify-between px-6">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => {
                setPosition(loop ? index + 1 : index);
              }}
              className={`
                h-2
                w-2
                rounded-full
                transition-colors
                ${
                  activeIndex === index
                    ? "bg-foreground"
                    : "bg-muted-foreground/30"
                }
              `}
              animate={{
                scale:
                  activeIndex === index ? 1.15 : 1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}