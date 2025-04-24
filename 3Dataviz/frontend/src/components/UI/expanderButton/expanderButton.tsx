import { ChangeEvent } from "react";
import { gsap } from "gsap";
import "./expanderButton.css";
import { ExpanderButtonProps } from "./props/expanderButtonProps";

function ExpanderButton({
  id,
  target,
  fromToX = [0, 0],
  fromToY = [0, 0],
}: ExpanderButtonProps) {
  const toggleExpand = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      gsap.to(target, {
        x: fromToX[1],
        y: fromToY[1],
        duration: 0.7,
        ease: "elastic.out(0.5,0.8)",
      });
    } else {
      gsap.to(target, {
        x: fromToX[0],
        y: fromToY[0],
        duration: 0.6,
        ease: "power4.out",
      });
    }
  };

  return (
    <>
      <div id={id} data-testid="expand-btn" className="expand-btn">
        <input type="checkbox" id={id + "-expand"} onChange={toggleExpand} />
        <label htmlFor={id + "-expand"} className="hide"></label>
      </div>
    </>
  );
}

export default ExpanderButton;
