"use strict";

app.factory("imgProcessFactory", () => {

  return {

    processImg (ctx, sw, sh) {
      //https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

      //create points array to store [R,G,B] formated point color values
      var points = [];

      //getImageData().data is a read-only 1D array in RGBA order
      let data = ctx.getImageData(0, 0, sw, sh).data;
      // console.log("data", data);
      for (var i = 0; i < data.length; i += 4){
        //i will always be at the index of the R value in RGBA sequence
        var r = data[i];
        var g = data[i+1];
        var b = data[i+2];
        points.push([r,g,b]);
      }
      // console.log("points", points);

      return points
    },


    fitImageOn (canvas, imageObj, ctx) {
      //adapted from blog below to resize canvas to final image dimensions after fitting
      //the image to the original, starting canvas size
      //http://sdqali.in/blog/2013/10/03/fitting-an-image-in-to-a-canvas-object/
      var imageAspectRatio = imageObj.width / imageObj.height;
      var canvasAspectRatio = canvas.width / canvas.height;
      var renderableHeight, renderableWidth, xStart, yStart;

      // If image's aspect ratio is less than canvas's we fit on height
      // and place the image centrally along width
      if(imageAspectRatio < canvasAspectRatio) {
        renderableHeight = canvas.height;
        renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      }

      // If image's aspect ratio is greater than canvas's we fit on width
      // and place the image centrally along height
      else if(imageAspectRatio > canvasAspectRatio) {
        renderableWidth = canvas.width
        renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      }

      // Happy path - keep aspect ratio
      else {
        renderableHeight = canvas.height;
        renderableWidth = canvas.width;
        xStart = 0;
        yStart = 0;
      }

      //set the canvas to the resized image dimensions
      canvas.width = renderableWidth;
      canvas.height = renderableHeight;

      ctx.drawImage(imageObj, 0, 0, renderableWidth, renderableHeight);

      return {sw:renderableWidth, sh:renderableHeight}
    }
    


  };

});
