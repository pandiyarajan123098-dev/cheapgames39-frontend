import { useEffect, useState } from "react";

export default function FlashSaleCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          if (minutes > 0) {
            minutes--;
            seconds = 59;
          } else {
            if (hours > 0) {
              hours--;
              minutes = 59;
              seconds = 59;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-3xl md:text-5xl font-bold text-red-500">
      {String(timeLeft.hours).padStart(2, "0")} :
      {String(timeLeft.minutes).padStart(2, "0")} :
      {String(timeLeft.seconds).padStart(2, "0")}
    </div>
  );
}