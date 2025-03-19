document.addEventListener("DOMContentLoaded", () => {
    function generatePath() {
      const svg = document.getElementById("responsive-svg");
      const pathBackground = svg.querySelector(".line-background");
      const pathProgress = svg.querySelector(".line-progress");
  
      const windowWidth = window.innerWidth - 240;
      const startX = windowWidth / 2;
      const startY = 133;
      const curveRadius = 50;
      const horizontalStretch1 = 349;
      const horizontalStretch2 = 338;
      const horizontalTotal = windowWidth;
  
      const originalVerticalHeight = 300;
      const additionalHeightPerPoint = 130;
      const numAdditionalPoints = 4;
      const adjustedVerticalHeight =
        originalVerticalHeight + additionalHeightPerPoint * numAdditionalPoints;
  
      const pathData = `
              M${startX} ${startY}
              v200
              a${curveRadius} ${curveRadius} 0 0 0 ${curveRadius} ${curveRadius}
              h${horizontalStretch1}
              a${curveRadius} ${curveRadius} 0 0 1 ${curveRadius} ${curveRadius}
              v200
              a${curveRadius} ${curveRadius} 0 0 1 -${curveRadius} ${curveRadius}
              h-${horizontalTotal}
              a${curveRadius} ${curveRadius} 0 0 0 -${curveRadius} ${curveRadius}
              v${adjustedVerticalHeight} 
              a${curveRadius} ${curveRadius} 0 0 0 ${curveRadius} ${curveRadius}
              h${horizontalStretch2}
          `;
  
      pathBackground.setAttribute("d", pathData);
      pathProgress.setAttribute("d", pathData);
  
      const pointGroups = svg.querySelectorAll(".point-group");
      const pathLength = pathProgress.getTotalLength();
  
      const pointPositions = [0.1, 0.39, 0.57, 0.67, 0.75, 0.81, 0.87, 1.0];
  
      pointGroups.forEach((group, index) => {
        if (index < pointPositions.length) {
          const position = pathLength * pointPositions[index];
          const pointCoords = pathProgress.getPointAtLength(position);
          const point = group.querySelector(".point");
          const pointCircle = group.querySelector(".point-circle");
          const textGroup = group.querySelector(".text-group");
  
          point.setAttribute("cx", pointCoords.x);
          point.setAttribute("cy", pointCoords.y);
          pointCircle.setAttribute("cx", pointCoords.x);
          pointCircle.setAttribute("cy", pointCoords.y);
  
          textGroup.setAttribute(
            "transform",
            `translate(${pointCoords.x + 20}, ${pointCoords.y - 20})`
          );
        }
      });
  
      const bbox = pathProgress.getBBox();
      const padding = 20;
      svg.setAttribute(
        "viewBox",
        `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + 2 * padding} ${
          bbox.height + 2 * padding
        }`
      );
    }
  
    function setupLineAnimation() {
      const path = document.querySelector(".line-progress");
      const pointGroups = document.querySelectorAll(".point-group");
      const pathLength = path.getTotalLength();
  
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
  
      window.addEventListener("scroll", () => {
        const scrollPercentage =
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100;
        const drawLength = (pathLength * scrollPercentage) / 100;
  
        path.style.strokeDashoffset = pathLength - drawLength;
  
        pointGroups.forEach((group, index) => {
          const point = group.querySelector(".point");
          const pointCircle = group.querySelector(".point-circle");
          const textGroup = group.querySelector(".text-group");
          const pointPosition =
            pathLength * [0.1, 0.39, 0.57, 0.67, 0.75, 0.81, 0.87, 1.0][index];
  
          if (drawLength >= pointPosition) {
            point.classList.add("active");
            pointCircle.classList.add("active");
            textGroup.classList.add("active");
          } else {
            point.classList.remove("active");
            pointCircle.classList.remove("active");
            textGroup.classList.remove("active");
          }
        });
      });
    }
  
    function makeSvgResponsive() {
      window.addEventListener("resize", () => {
        generatePath();
        setupLineAnimation();
      });
      generatePath();
    }
  
    generatePath();
    setupLineAnimation();
    makeSvgResponsive();
  });