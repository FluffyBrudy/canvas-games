# Simple google-dino like endless runner game.
 Canvas is nightmare for image since it uses DOM's HTMLImageElement and for each image we make a temporary image and extract out RGBA via Uint8ClampedArray and not even 2d array but linear. So i manaully implemented few things. Those things were builtin into pygame.

- accessing row major array element at `x,y` using 
   ```javascript
   elemAt(x, y) = (y * width + dx) * 4 + 3
   ```
- check normal rect collision by checking overlap using
    ```javascript
    a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
    ```
- pixel perfect collision
  - check if rect collision occur. If this is omitted then goodbye
  - find left and right overlap
  - iterate y coor as  row and x coor
  - access pixel using row-major indexing technique mention above
  - simplest of all to check if pixel perfect collision is, if both of image has alpha > 0 then its collision
  for refrence look this function `pixelPerfectCollision` located at file [`image.utils.ts`](src/utils/image.utils.ts) contains helper functions for working with images.


- spawn is basically nothing gap between min and max space and tracking previous position
- animation are just frames
- I tried to implement spawn based on world dist but couldnt later realized that i was using increasing distance
- Basically made game in OOP pattern but somewhere code is repeated and its ok i guess because i dont like multilevel inheritance, a silent reason for unwanted mutation of attrs and unwanted tweaks.

## this is it, if u want to improve give a PR