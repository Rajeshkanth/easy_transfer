import { memo, useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "../../assets/utils/cn";

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
            <motion.span key={word + idx} className=" text-gray-900 opacity-0">
              {word}
              {idx !== wordsArray.length - 1 && <br />}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div>
        <div className=" dark:text-white text-white text-2xl leading-snug tracking-wide font-poppins font-light grid items-center sm:text-4xl md:text-5xl xl:text-6xl">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export default memo(TextGenerateEffect);
