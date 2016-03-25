"use strict";

app.factory("colorscaleFactory", () => {

  return {
    saturationScaleHSL(hslArr, percentStep) {
      //percent step given as a decimal eg. 0.05, 0.1, etc

      //Write as percentages, current start at 100%
      var current = 0;
      var h = hslArr[0];
      var s = hslArr[1] * 100;
      var l = hslArr[2] * 100;
      var newS = 1;

      var hslScale = [];

      while (newS > .0001){
        newS = s * (1-current);
        current += percentStep;
        hslScale.push([h, newS, l]);
      }
      
      return hslScale;
    }

  };
});
