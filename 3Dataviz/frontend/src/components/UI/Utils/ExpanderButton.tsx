import { ChangeEvent } from "react";
import { gsap } from "gsap";
import "./ExpanderButton.css"

type ExpanderButtonProps = {
    target:string
    id:string
    fromToX?: [number,number]
    fromToY?: [number,number]
}

function ExpanderButton({id,target,fromToX =[0,0],fromToY=[0,0]}:ExpanderButtonProps) {
    const ToggleExpand = (e: ChangeEvent<HTMLInputElement>) => {
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
    
    return(
        <>
        <div id={id} className="expand-btn">
          <input type="checkbox" id={id+"-expand"} onChange={ToggleExpand} />
          <label htmlFor={id+"-expand"} className="hide"></label>
        </div>
        </>
    )
}

export default ExpanderButton