import React, { useRef } from "react";
import { Stage, Layer, Rect } from "react-konva";

const App = props => {
  // from https://stackoverflow.com/questions/47395110/selecting-by-drawing-a-box-around-objects-in-konva
  const mainWidth = window.innerWidth;
  const mainHeight = window.innerHeight;

  const stageRef = useRef(); //s1
  const drawRectRef = useRef(); //r1
  const rubberRectRef = useRef(); //r2

  var posStart;
  var posNow;
  var mode = "";

  function reverse(r1, r2) {
    var r1x = r1.x,
      r1y = r1.y,
      r2x = r2.x,
      r2y = r2.y,
      d;
    if (r1x > r2x) {
      d = Math.abs(r1x - r2x);
      r1x = r2x;
      r2x = r1x + d;
    }
    if (r1y > r2y) {
      d = Math.abs(r1y - r2y);
      r1y = r2y;
      r2y = r1y + d;
    }
    return { x1: r1x, y1: r1y, x2: r2x, y2: r2y };
  }

  function startDrag(posIn) {
    posStart = { x: posIn.x, y: posIn.y };
    posNow = { x: posIn.x, y: posIn.y };
  }

  function updateDrag(posIn) {
    posNow = { x: posIn.x, y: posIn.y };
    var posRect = reverse(posStart, posNow);
    rubberRectRef.current.x(posRect.x1);
    rubberRectRef.current.y(posRect.y1);
    rubberRectRef.current.width(posRect.x2 - posRect.x1);
    rubberRectRef.current.height(posRect.y2 - posRect.y1);
    rubberRectRef.current.visible(true);

    stageRef.current.draw();
  }

  const onMouseDown = e => {
    mode = "drawing";
    startDrag({ x: e.evt.layerX, y: e.evt.layerY });
  };

  const onMouseUp = e => {
    console.log("Mouse up");
    mode = "";
    rubberRectRef.current.visible(false);
    stageRef.current.draw();
  };

  const onMouseMove = e => {
    if (mode === "drawing") {
      updateDrag({ x: e.evt.layerX, y: e.evt.layerY });
    }
  };

  return (
    <div>
      <div>
        <Stage ref={stageRef} width={mainWidth} height={mainHeight}>
          <Layer>
            <Rect
              ref={rubberRectRef}
              x={0}
              y={0}
              stroke="black"
              width={0}
              height={0}
              dash={[2, 2]}
            />
            <Rect
              ref={drawRectRef}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
              x={0}
              y={0}
              width={mainWidth}
              height={mainHeight}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default App;
