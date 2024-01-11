/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".loader": {
          width: "60px",
          aspectRatio: "1.154",
          "--c": "#0000, #25b09b 2deg 59deg, #0000 61deg",
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
          backgroundColor: "rgb(215, 231, 229)",
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        ".wrapper": {
          height: "10vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgb(215, 231, 229)",
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
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "block",
          strokeWidth: 2,
          stroke: "#fff",
          strokeMiterlimit: 10,
          margin: "10% auto",
          boxShadow: "inset 0px 0px 0px #7ac142",
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
            boxShadow: "inset 0px 0px 0px 30px #7ac142",
          },
        },
        ".fail-icon": {
          fontSize: "44px",
          color: "red",
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
  ],
};
