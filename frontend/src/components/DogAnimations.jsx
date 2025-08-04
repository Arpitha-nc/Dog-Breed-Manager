const DogAnimations = () => {
  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 2.5s ease-in-out infinite;
        }
      `}</style>

      <span
        className="absolute text-6xl animate-float hidden sm:block"
        style={{ left: "5%", top: "15%", transform: "rotate(-10deg)" }}
        role="img"
        aria-label="Cute dog emoji"
      >
        🐶
      </span>
      <span
        className="absolute text-9xl animate-bounce hidden sm:block"
        style={{ right: "8%", bottom: "10%", transform: "rotate(5deg)" }}
        role="img"
        aria-label="Another cute dog emoji"
      >
        🐕
      </span>
      <span
        className="absolute text-8xl animate-float"
        style={{
          left: "20%",
          bottom: "5%",
          animationDuration: "4s",
          transform: "rotate(15deg)",
        }}
        role="img"
        aria-label="Happy dog emoji"
      >
        🐾
      </span>
      <span
        className="absolute text-4xl animate-bounce"
        style={{
          right: "20%",
          top: "5%",
          animationDuration: "3.5s",
          transform: "rotate(-20deg)",
        }}
        role="img"
        aria-label="Playful dog emoji"
      >
        🐶
      </span>
    </>
  );
};

export default DogAnimations;
