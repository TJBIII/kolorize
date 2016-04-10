# Kolorize
##### A color palette tool aimed at developers and designers. 
Colors can be added to a palette from a simple color picker or by extracting colors from images. Behind the scenes, a K-Means clustering technique is used for the color extraction. Images can be uploaded from a user's computer or found by searching tags with the Flickr API. Users can save their palettes and also browse and fork palettes created by other users. There is also the ability to preview HTML templates styled with palette colors. Previews of the template are generated with the palette colors cycled through the different sections (navigation/header, body, and footer), so the user can see the different color combinations without having to manually swap out colors in their CSS.

## Installation
1. Clone the repo
```
git clone https://github.com/TJBIII/kolorize.git
```
2. Navigate into the `lib` directory
3. Install the required packages
```
npm install
bower install
```


## Built Using:
* Angular
* Materialize CSS
* Firebase
* Gulp
* Karma
* Jasmine
* Angular Deckgrid - for displaying Flickr photos
* Dom-To-Image - for creating HTML preview images