# transformable

Transformable is a vanilla javascript library for adding translation (panning), scaling (resizing) and rotation to HTML elements via a 2D CSS transformation matrix.

It works with mouse and touch events to scale, rotate or move elements. You can use pinch gestures too. 

Rotate handles allow you to rotate around the centre of the element (default) or you can move the rotation handle somewhere else to rotate about another point. 

Transformable elements can be nested within each other and it shouldn't matter if there are other non-transformable elements/parentnodes in between. 

## Loading

You just need to include the stylesheet and one javascript file:
```
<link rel="stylesheet" href="/css/transformable.css" />
<script src="/js/transformable.js"></script>
```
There is a minified version created with uglifyjs (48Kb). 

## Usage
Create a new instance and pass in an HTML element
```
var myref = new Transformable(document.getElementById('one'));

// pass options
var myref2 = new Transformable(document.getElementById('two'), { contain: 'enclose', resize:'tl-br' });
```
## Options
```
opts = { 
  // Use to contain the transformable element within its parent element.
  // 'enclose' to keep an element within the parent.
  // 'cover' if the element is big enough, it will keep the element covering the background of 
  // the parent useful when you have an image to move around within an element and you want it to
  // cover all the parent's background.
  contain: 'enclose',
  
  // show move and resize handles in top-left and bottom-right
  resize: 'tl-br', 
  
  // intialise the element with a transformation matrix if you need to.
  // Use an array with 6 elements or an instance of Matrix
  // it will apply on top of any transformations already defined in CSS (i.e. multiplied with a stylesheet transform)
  // It's not needed, you can do it all in CSS if you prefer
  matrix: [1, 0, 0, 1, -100, 28],
  
  // Advanced: initialise with a relative size. This is useful if you previously recorded the transformation matrix 
  // after user interaction then need to redraw the transformed element again later. Because translations use px units,
  // the element might not be in the same position as before for the same transformation matrix. 
  computedsize: { width: 345, height: 789 },
  
  // on start event.
  start: function() { /* do something */ },
  
  // on move event. Try not to use this for anything other than basic stuff. The event will fire
  // many, many times per second
  move: function() { /* do almost nothing */ },
  
  // on stop event.
  stop: function() { /* do something */ },
  
  // on tap/click
  tap: function() { /* do something */ }
  
  // say if start/stop/tap should be attached to the element, default is true
  attachevents: true,
  
  // say if the transformable element can be interacted with, default is true.
  editable: true,
  
  // disable the transformable element, default is false
  disabled: true,
  
  // disable specific transformations, mix and match. Missing out a named transformation will keep it enabled
  // zoom/wheel are used to switch off mouse wheel zoom. 
  // mouse wheel zoom is always off on Mac due to crazy behavior with a magic mouse 
  disable: { 
    scale: false, 
    rotate: true, 
    translate: false,
    wheel: false,
    zoom: true 
  },
  
  // internal option to make handles etc. work correctly. Do not use.
  // can be: 'rotator-box' only (for now)
  type: 'dont-set-this-option',
  
  // internal option to specify another Transformable instance to receive the transform. Do not use
  // it is used to make rotate handles work
  rotatetarget: instanceofTransformable
  
}
```
    




