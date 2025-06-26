import React, { useEffect, useState, useRef } from "react";
import Button from '../common/button/button.jsx';
import { useRouter } from 'next/router';

const ErrorStack = () => {
  const router = useRouter();
  const stackErrorContainerRef = useRef(null);
  const [counter, setCounter] = useState(5);

   // Auto-redirect when counter hits 0
   useEffect(() => {
    if (counter === 0) {
      const timeout = setTimeout(() => {
        router.push('/');
      }, 1500); // wait a bit for the animation to finish
      return () => clearTimeout(timeout);
    }
  }, [counter, router]);

  useEffect(() => {
    if(counter === 0) {
      router.push('/');
    }
    const intervalId = setInterval(() => {
      setCounter((prevCount) => prevCount - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  // Function to generate random number

  const randomIntFromInterval = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

  useEffect(() => {
    const stackErrorContainer = stackErrorContainerRef.current;
    const cardNodes = stackErrorContainer.querySelectorAll(".card-ErrorContainer");
    const perspecNodes = stackErrorContainer.querySelectorAll(".perspec");
    const card = stackErrorContainer.querySelector(".card");

    const handleCardAnimationEnd = () => {
      perspecNodes.forEach((elem) => elem.classList.add("explode"));
    };

    const handlePerspecAnimationEnd = (e) => {
      if (e.animationName === "explode") {
        cardNodes.forEach((elem, index) => {
          elem.classList.add("pokeup");

          const handleClick = () => {
            const updown = [800, -800];
            const randomY = updown[Math.floor(Math.random() * updown.length)];
            const randomX = Math.floor(Math.random() * 1000) - 1000;

            elem.style.transform = `translate(${randomX}px, ${randomY}px) rotate(-540deg)`;
            elem.style.transition = "transform 1s ease, opacity 2s";
            elem.style.opacity = "0";

            setCounter((prevCounter) => {
              const newCounter = prevCounter - 1;
              if (newCounter === 0) {
                stackErrorContainer.style.width = "0";
                stackErrorContainer.style.height = "0";
              }
              return newCounter;
            });

            elem.removeEventListener("click", handleClick); // Prevent multiple clicks
          };

          elem.addEventListener("click", handleClick);

          // Generate random lines of code
          let numLines = randomIntFromInterval(5, 10);
          for (let i = 0; i < numLines; i++) {
            let lineLength = randomIntFromInterval(25, 97);
            let node = document.createElement("li");
            node.classList.add(`node-${i}`);
            node.style.setProperty("--linelength", `${lineLength}%`);
            elem.querySelector(".code ul").appendChild(node);

            if (i === 0) {
              node.classList.add("writeLine");
            } else {
              elem
                .querySelector(`.code ul .node-${i - 1}`)
                .addEventListener("animationend", () => {
                  node.classList.add("writeLine");
                });
            }
          }
        });
      }
    };

    // Event listeners
    card.addEventListener("animationend", handleCardAnimationEnd);
    stackErrorContainer.addEventListener("animationend", handlePerspecAnimationEnd);

    return () => {
      card.removeEventListener("animationend", handleCardAnimationEnd);
      stackErrorContainer.removeEventListener("animationend", handlePerspecAnimationEnd);
    };
  }, []);

  return (
    <div className="ErrorContainer">
      <div className="error">
        <h1>500</h1>
        <h2>Error</h2>
        <p>
          We encountered an unexpected error. Our team has been notified and is working on a fix.
          In the meantime, you can try refreshing the page or return to the
        </p>

        <Button
          btnText={"Back To Home"}
          width={typeof window !== 'undefined' && window.innerWidth <= 768 ? '70vw' : '40vw'}
          padding={typeof window !== 'undefined' && window.innerWidth < 768 ? '8px' : '12px'}
          otherStyles={{
            fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '14px' : '16px',
          }}
         
          onClick={() => router.push('/')}
        />
      </div>

      <div className="stack-ErrorContainer" ref={stackErrorContainerRef}>
        {[...Array(6)].map((_, index) => (
          <div className="card-ErrorContainer" key={index}>
            <div
              className="perspec"
              style={{
                "--spreaddist": `${125 - index * 25}px`,
                "--scaledist": `${0.75 + index * 0.05}`,
                "--vertdist": `${-25 + index * 5}px`
              }}
            >
              <div className="card">
                <div className="writing">
                  <div className="topbar">
                    <div className="red"></div>
                    <div className="yellow"></div>
                    <div className="green"></div>
                  </div>
                  <div className="code">
                    <ul></ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ErrorStack;
