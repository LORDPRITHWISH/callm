export default function GradientText({
    children,
    className = "",
    colors = ["#40ffaa, #4079ff, #40ffaa, #4079ff, #40ffaa"],
    animationSpeed = 8,
    showBorder = false,
    size = "default", 
  }) {
    const gradientStyle = {
      backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
      animationDuration: `${animationSpeed}s`,
    };
  
 
    let sizeClass = "text-3xl md:text-4xl font-bold"; 
  
    if (size === "large") {
      sizeClass = "text-4xl md:text-5xl lg:text-6xl font-bold";
    } else if (size === "medium") {
      sizeClass = "text-3xl md:text-4xl lg:text-5xl font-bold";
    } else if (size === "small") {
      sizeClass = "text-2xl md:text-3xl font-bold";
    }
  
    return (
      <div
        className={`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${className}`}
      >
        {showBorder && (
          <div
            className="absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient"
            style={{
              ...gradientStyle,
              backgroundSize: "300% 100%",
            }}
          >
            <div
              className="absolute inset-0 bg-black rounded-[1.25rem] z-[-1]"
              style={{
                width: "calc(100% - 2px)",
                height: "calc(100% - 2px)",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            ></div>
          </div>
        )}
        <div
          className={`inline-block relative z-2 text-transparent bg-cover animate-gradient ${sizeClass}`}
          style={{
            ...gradientStyle,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            backgroundSize: "300% 100%",
          }}
        >
          {children}
        </div>
      </div>
    );
  }
  
  // Make sure you have these animations in your tailwind.config.js
  // module.exports = {
  //   theme: {
  //     extend: {
  //       keyframes: {
  //         gradient: {
  //           '0%': { backgroundPosition: '0% 50%' },
  //           '50%': { backgroundPosition: '100% 50%' },
  //           '100%': { backgroundPosition: '0% 50%' },
  //         },
  //       },
  //       animation: {
  //         gradient: 'gradient 8s linear infinite'
  //       },
  //     },
  //   },
  //   plugins: [],
  // };