const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif", "!important"],
      },
      spacing: {
        57.5: "57.5rem",
        34: "34rem",
        39.5: "39.5rem",
        "8/5": "85%",
      },
      backgroundColor: {
        white: "#ffffff !important",
      },
      colors: {
        "red-600": "#DC2626 !important",
      },
      borderRadius: {
        lg: "0.5rem !important",
        "tr-0": "0.5rem 0 0 0.5rem !important",
        "br-0": "0.5rem 0 0 0.5rem  !important",
      },
      height: {
        "10-v": "10vh",
        "20-v": "20vh",
        "31-v": "31vh",
        "35-v": "35vh",
        "40-v": "40vh",
        "50-v": "50vh",
        "55-v": "55vh",
        "60-v": "60vh",
        "custom-81": "81vh",
        "custom-27": "27rem",
        "custom-30": "30rem",
        "custom-35": "35rem",
        "custom-40": "40rem",
        "custom-90": "90%",
        "custom-80": "80%",
        "custom-10": "10%",
        "9/10": "90%",
        "9-r": "9.375rem",
        "7-r": "7.5rem",
        "12-r": "12.5rem",
        "13-r": "13rem",
        "17-r": "17rem",
      },
      minHeight: {
        10: "10%",
        30: "30%",
        40: "40%",
      },
      maxWidth: {
        65: "17rem",
      },
      width: {
        "8/8": "88%",
        "8/1": "83%",
        "8/2": "82%",
        "7/8": "78%",
        "custom-98": "98%",
        "custom-90": "90%",
        "custom-80": "80%",
        "custom-85": "85%",
        "custom-70": "70%",
        "custom-60": "60%",
        "custom-65": "65%",
        "custom-58": "58%",
        "custom-47": "47%",
        "custom-36": "36%",
        "custom-33": "33%",
        "custom-30": "30%",
        9: "9.375rem",
        7: "7.5rem",
        12: "12.5rem",
        20: "20vw",
        24: "24vw",
        28: "28vw",
        30: "30vw",
        31: "31vw",
        38: "38vw",
        40: "40vw",
        33: "33vw",
        37: "37vw",
      },

      margin: {
        "l-1-4": "0 0 0 1.4vw",
        "l-3": "0 0 0 3vw",
        "l-23": "0 0 0 23.8vw",
        "l-25": "0 0 0 25vw",
        "l-35": "0 0 0 35vw",
        "l-57": "0 0 0 56.5vw",
        "l-42": "0 0 0 42vw",
        "l-22": "22rem",
        "l-10": "10.5rem",
        "ml-minus-2-per": "2%",
        "ml-minus-2": "-2rem",
        "ml-minus-3": "-3rem",
        "ml-minus-4": "-4rem",
        "ml-minus-6": "-6rem",
        "ml-minus-9": "-9rem",
        "ml-minus-8": "-.8rem",
        "ml-minus-1": "-1rem",
        "ml-6": "6rem",
        "mt-20": "-20rem",
        "mt-22": "-22.5rem",
        "mt-47": "-47rem",
        "mt-25": "-25.5rem",
        "mt-8": "-.8rem",
        "mt-4/5": "-4.5rem",
        "mt-6/5": "-6.5rem",
        "mt-7/5": "-7.5rem",
        "mt-9/5": "-9.5rem",
        "minus-t-8": "-.8rem 0 0 0",
        "minus-t-4": "-.4rem 0 0 0",
        "minus-t-5": "-.5rem 0 0 0",
        "minus-t-6": "-.6rem 0 0 0",
        "t-2": "0.2rem 0 0 0 ",
        "mt-30v": "30vh",
        "mt-35v": "35vh",
        "mt-25v": "25vh",
        "mt-28v": "28vh",
      },
      zIndex: {
        20: "20",
        100: "100",
        200: "200",
      },
      fontSize: {
        16: "1rem",
      },

      keyframes: {
        expand: {
          "0%": { width: "10%" },
          "100%": { width: "auto" },
        },
      },
      animation: {
        expand: "expand 1s linear 1",
        meteor: "meteor 5s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".loader": {
          width: "3.75rem",
          aspectRatio: "1.154",
          "--c": "#0000, #ffffff 2deg 59deg, #0000 61deg",
          "--c1": "conic-gradient(from 149deg at top, var(--c))",
          "--c2": "conic-gradient(from -31deg at bottom, var(--c))",
          background:
            "var(--c1) top, var(--c1) bottom right, var(--c2) bottom, var(--c1) bottom left",
          backgroundSize: "50% 50%",
          backgroundRepeat: "no-repeat",
          animation: "l37 1s infinite",
          marginBottom: "1rem",
        },
        "@keyframes l37": {
          "80%, 100%": {
            backgroundPosition: "bottom right, bottom left, bottom, top",
          },
        },
        ".loading": {
          backgroundColor: "#4B5563",
        },
        ".wrapper": {
          backgroundColor: "#4B5563",
        },
        ".checkmark__circle": {
          strokeDasharray: 166,
          strokeDashoffset: 166,
          strokeWidth: 2,
          strokeMiterlimit: 10,
          stroke: "#7ac142",
          fill: "none",
          animation: "stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards",
        },
        ".checkmark": {
          strokeWidth: 2,
          stroke: "#fff",
          strokeMiterlimit: 10,
          animation:
            "fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both",
        },
        ".checkmark__check": {
          transformOrigin: "50% 50%",
          strokeDasharray: 48,
          strokeDashoffset: 48,
          animation: "stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards",
        },
        "@keyframes stroke": {
          "100%": {
            strokeDashoffset: 0,
          },
        },
        "@keyframes scale": {
          "0%, 100%": {
            transform: "none",
          },
          "50%": {
            transform: "scale3d(1.1, 1.1, 1)",
          },
        },
        "@keyframes fill": {
          "100%": {
            boxShadow: "inset 0px 0px 0px 1.875rem #7ac142",
          },
        },
        ".fail-icon": {
          fontSize: "2.75rem",
          color: "white",
        },
        mortar: {
          50: "#f7f6f8",
          100: "#edeaef",
          200: "#e0d9e4",
          300: "#cabfd1",
          400: "#b0a0ba",
          500: "#9f89a8",
          600: "#917799",
          700: "#856b8a",
          800: "#6f5a73",
          900: "#534556",
          950: "#39303b",
        },
      };

      addUtilities(newUtilities);
    },
    function ({ addVariant }) {
      addVariant("contentEditable", '&[contentEditable="true"]');
    },
    addVariablesForColors,
  ],
};
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
