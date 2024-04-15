const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "form-bg":
          "url('https://images.ctfassets.net/jwea2w833xe7/29MVRQN52gZ5mzeERWn7fl/6e0905fb853df590526d2d6c8cac7787/bank_desktop_layer_03.webp')",
        "form-login-bg":
          "url('https://images.ctfassets.net/jwea2w833xe7/tNVzSyTyL12aLV0AVJDPa/55824ff57503cee90f7916be5e172705/send_desktop_layer_01.webp')",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif", "!important"],
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
        68: "17rem",
        99: "27rem",
        100: "30rem",
        128: "32rem",
        106: "35rem",
        112: "40rem",
        113: "41rem",
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
        100: "30rem",
        "custom-95": "95%",
      },
      margin: {
        92: "22.5rem",
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
          aspectRatio: "1.154",
          "--c": "#0000, #ffffff 2deg 59deg, #0000 61deg",
          "--c1": "conic-gradient(from 149deg at top, var(--c))",
          "--c2": "conic-gradient(from -31deg at bottom, var(--c))",
          background:
            "var(--c1) top, var(--c1) bottom right, var(--c2) bottom, var(--c1) bottom left",
          backgroundSize: "50% 50%",
          backgroundRepeat: "no-repeat",
          animation: "l37 1s infinite",
        },
        "@keyframes l37": {
          "80%, 100%": {
            backgroundPosition: "bottom right, bottom left, bottom, top",
          },
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
