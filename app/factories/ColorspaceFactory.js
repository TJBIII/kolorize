"use strict";

app.factory("colorspaceFactory", function () {

  function componentToHex (c) {
      var hex = Math.floor(c).toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

  return {

    compliment (rgb) {
      let temprgb=rgb;
      // console.log("temprgb", temprgb);
      let temphsv=RGB2HSV(temprgb);
      // console.log("temphsv", temphsv);
      temphsv[0]=HueShift(temphsv[0],180.0);
      console.log(HSV2RGB(temphsv));
      return HSV2RGB(temphsv);

      function RGB2HSV(rgb) {
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        var hsv = [0, 0, 0];
        let max=max3(r,g,b);
        let dif=max-min3(r,g,b);
        hsv[1]=(max==0.0)?0:(100*dif/max);
        if (hsv[1]==0) hsv[0]=0;
        else if (r==max) hsv[0]=60.0*(g-b)/dif;
        else if (g==max) hsv[0]=120.0+60.0*(b-r)/dif;
        else if (b==max) hsv[0]=240.0+60.0*(r-g)/dif;
        if (hsv[0]<0.0) hsv[0]+=360.0;
        hsv[2]=Math.round(max*100/255);
        hsv[0]=Math.round(hsv[0]);
        hsv[1]=Math.round(hsv[1]);
        return hsv;
      }


      function HSV2RGB(hsv) {
        var r;
        var g;
        var b;
        var h = hsv[0];
        var s = hsv[1];
        var v = hsv[2];
          if (s==0) {
              r=g=b=Math.round(v*2.55);
          } else {
              h/=60;
              s/=100;
              v/=100;
              let i=Math.floor(h);
              let f=h-i;
              let p=v*(1-s);
              let q=v*(1-s*f);
              let t=v*(1-s*(1-f));
              switch(i) {
              case 0: r=v; g=t; b=p; break;
              case 1: r=q; g=v; b=p; break;
              case 2: r=p; g=v; b=t; break;
              case 3: r=p; g=q; b=v; break;
              case 4: r=t; g=p; b=v; break;
              default: r=v; g=p; b=q;
              }
              r=Math.round(r*255);
              g=Math.round(g*255);
              b=Math.round(b*255);
          }
          return [r, g, b];
      }

      function HueShift(h,s) { 
        h+=s; while (h>=360.0) h-=360.0; while (h<0.0) h+=360.0; return h; 
      }


      function min3(a,b,c) { 
        return (a<b)?((a<c)?a:c):((b<c)?b:c); 
      }


     function max3(a,b,c) { 
        return (a>b)?((a>c)?a:c):((b>c)?b:c); 
      }
    },


    RGB2HSL(rgbArr){
      let r = rgbArr[0]/ 255, g = rgbArr[1] / 255, b = rgbArr[2]/ 255;
      let max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if(max == min){
          h = s = 0; // achromatic
      }else{
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
              case r: h = (g - b) / d + (g < b ? 6 : 0); break;
              case g: h = (b - r) / d + 2; break;
              case b: h = (r - g) / d + 4; break;
          }
          h *= 60;
      }
      console.log("hsl:", [h,s,l])
      return [h, s, l];
    },


    rgbStringToHSL(str){
      var rgb = str.match(/\d+/g);
      //console.log(rgb);
      rgb = rgb.map(colorValue => Number(colorValue))
      // console.log("rgb", rgb); 
      return rgbToHsl(rgb);
    },


    rgbStringToRGB(str){
      var rgb = str.match(/\d+/g);
      //console.log(rgb);
      rgb = rgb.map(colorValue => Number(colorValue))
      // console.log("rgb", rgb); 
      return rgb;
    },


    rgbToHex(point) {
      var hexColor = "#" + componentToHex(point[0]) + componentToHex(point[1]) + componentToHex(point[2]);
      return hexColor;
    },


    hexToRgb(hex) {
      hex = hex.replace(/[^0-9A-F]/gi, '');
      var bigint = parseInt(hex, 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;

      return [r, g, b];
    },


    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * 
     * @return  Array           The RGB representation
     */
    hslToRgb (hslArr) {

        //scale so h, s, and l are in the set [0,1]
        let h = hslArr[0]/360,
            s = hslArr[1]/100,
            l = hslArr[2]/100;

        let r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

  };
});
