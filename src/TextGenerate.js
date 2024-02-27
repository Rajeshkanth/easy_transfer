import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "./utils/cn.js";

export const TextGenerateEffect = ({ words, className }) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split("\n");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-white opacity-0"
              // dangerouslySetInnerHTML={{ __html: word }}
            >
              {word}
              {idx !== wordsArray.length - 1 && <br />}{" "}
              {/* Add <br /> except for the last word */}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-white text-4xl leading-snug tracking-wide  font-sans  font-light mt-[12rem] ml-[0rem]  md:text-5xl lg:text-6xl">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
