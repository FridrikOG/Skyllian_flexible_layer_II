import { useState, useEffect } from "react";

const Countdown = (props) => {
  const {
    initHours = 0,
    initMinutes = 0,
    initSeconds = 20,
    initDays = 0,
    setIsLocked,
    isLocked,
  } = props;
  console.log(initSeconds);
  const [hours, setHours] = useState(initHours);
  const [minutes, setMinutes] = useState(initMinutes);
  const [seconds, setSeconds] = useState(initSeconds);
  const [days, setDays] = useState(initDays);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds === 0) {
        setIsLocked(false);
        clearInterval(myInterval);
        // if (minutes === 0) {
        //   if (hours === 0) {
        //     if (days === 0) {
        //       setIsLocked(false);
        //       clearInterval(myInterval);
        //     } else {
        //       // Days not 0
        //       setDays(days - 1);
        //       setHours(59);
        //       setMinutes(59);
        //       setSeconds(59);
        //     }
        //   } else {
        //     // Hours not 0
        //     setHours(hours - 1);
        //     setMinutes(59);
        //     setSeconds(59);
        //   }
        // } else {
        //   // Minutes not 0
        //   setMinutes(minutes - 1);
        //   setSeconds(59);
        // }
      } else {
        // Seconds not 0
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  useEffect(() => {
    console.log("useEffect");
    // If unlocked, do not restart count
    if (!isLocked) return;
    setSeconds(initSeconds);
  }, [initSeconds, isLocked]);

  const getCountDown = () => {
    return (
      <h1>
        {/* {initSeconds} */}
        {/* {seconds} */}
        {days}:{hours}:{minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </h1>
    );
  };

  console.log(seconds);

  return (
    <div>
      {seconds === 0 ? (
        <h3>Question Unlocked !</h3>
      ) : (
        <div>
          <h2>Question becomes available in</h2>
          {getCountDown()}
        </div>
      )}
    </div>
  );
};

export default Countdown;
