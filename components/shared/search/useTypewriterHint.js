import { useEffect, useState } from "react";

/*
  Rotating search hint for placeholders: types a hint, holds it, erases it,
  then the next one, forever. Used by the desktop search box and the phone
  search bar so both show the same examples.

  Usage:
    const hint = useTypewriterHint(paused);   // paused = user is typing / listening
    <input placeholder={`Search ${hint}`} />
*/
export const SEARCH_HINTS = [
  '"Golf Course Road"',
  '"3 BHK under 2 Cr"',
  '"Dwarka Expressway"',
  '"Tulip Monsella"',
  '"Ready to move in Sector 79"',
  '"4 BHK penthouse"',
  "locality, project or developer",
];

const TYPE_MS = 70; // per letter while typing
const ERASE_MS = 35; // per letter while erasing
const HOLD_MS = 1600; // how long a full hint stays

export function useTypewriterHint(paused = false) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (paused) return;
    const hint = SEARCH_HINTS[index];
    let chars = 0;
    let erasing = false;
    let timer;

    const tick = () => {
      if (!erasing) {
        chars++;
        setText(hint.slice(0, chars));
        if (chars === hint.length) {
          erasing = true;
          timer = setTimeout(tick, HOLD_MS);
          return;
        }
        timer = setTimeout(tick, TYPE_MS);
      } else {
        chars--;
        setText(hint.slice(0, chars));
        if (chars === 0) {
          setIndex((i) => (i + 1) % SEARCH_HINTS.length);
          return;
        }
        timer = setTimeout(tick, ERASE_MS);
      }
    };

    timer = setTimeout(tick, TYPE_MS);
    return () => clearTimeout(timer);
  }, [index, paused]);

  return text;
}
