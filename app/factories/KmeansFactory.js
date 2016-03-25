"use strict";

app.factory("kmeansFactory", () => {


  function calculateDistance(point1, point2) {
    //returns the square of the distance between point1 and point2 in 3D space.
    // Math.sqrt() has been omitted for increased performance
    let dist = 0;
    for (let i = 0; i < point1.length; i++){
      dist += Math.pow(point1[i] - point2[i], 2);
    }
    return dist;
  }

  function calculateCenter(points, numOfDimensions){
    //finds the center of the given array of points. 
    let numPoints = 0;
    let values = [];
    for (let i = 0; i < numOfDimensions; i++){
      values.push(0);
    }

    for (let i = 0; i < points.length; i++) {
      numPoints++;
      for (let j = 0; j < numOfDimensions; j++){
        values[j] += points[i][j];
      }
    }
    for (let i = 0; i < numOfDimensions; i++){
      values[i] = values[i] / numPoints;
    }
    return values;
  }



  return {
    kmeans (points, k, minDiff) {
      let pointsLength = points.length,
        clusters = [],
        visited = [],
        index,
        found;

      //keep track of the loop in case we get stuck in a local minimum 
      let count = 0;

      while (clusters.length < k) {
        index = parseInt(Math.random() * pointsLength);
        found = false;
        for (let i = 0; i < visited.length; i++){
          if (index === visited[i]) {
            found = true;
            break;
          }
        }

        if (!found) {
          visited.push(index);
          // console.log("points[index]", points[index]);
          clusters.push([points[index], [points[index]]]);
        }

      }


      //for every point, find which mean it is closest too
      let pointsLists;


      while (true) {
        pointsLists = [];
        for (let i = 0; i < k; i++) {
          pointsLists.push([]);
        }

        for (let j = 0; j < pointsLength; j++) {
          let p = points[j],
              smallestDistance = 1e5,
              currentIndex = 0;

          for (let i = 0; i < k; i ++ ) {
            let distance = calculateDistance(p, clusters[i][0]);
            if (distance < smallestDistance){
              smallestDistance = distance;
              currentIndex = i;
            }
          }
          pointsLists[currentIndex].push(p);
        }


        let difference = 0;
        for (let i = 0; i < k; i++) {
          let old = clusters[i];
          let list = pointsLists[i];
          //console.log("pointsLists[i]", pointsLists[i] );
          let center = calculateCenter(pointsLists[i], 3);
          //console.log("center", center);
          count++;

          // return false to reinitiate kmeans function when stuck in a local minimum
          if (count > 200){
            console.log("clusters", clusters);
            return false;
          }

          let newCluster = [center, (pointsLists[i])];
          let distance = calculateDistance(old[0], center);

          clusters[i] = newCluster;
          difference = difference > distance ? difference : distance;
        }


        //break once the difference between the old center and the new center is less than the minDiff
        if (difference < minDiff){
          break;
        }
      }

      return clusters;
    }
  }



});
