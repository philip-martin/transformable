# transformable

Transformable is a vanilla javascript library for adding translation (panning), scaling (zoom) and rotation to HTML elements via a 2D CSS transformation matrix.

It works with mouse and touch events to scale, rotate or move elements. You can use pinch gestures and mouse wheel too. 

Rotate handles allow you to rotate around the centre of the element (default) or you can move the rotation handle somewhere else to rotate about another point. Resize handles can be dragged to change the elements width/height.

Transformable elements can be nested within each other and the depth/position in the node heirarchy won't matter.

Examples coming soon!

## Loading

You just need to include the stylesheet and one javascript file:
```
<link rel="stylesheet" href="/css/transformable.css" />
<script src="/js/transformable.js"></script>
```
There is a minified version created with uglifyjs (48Kb). 

## Usage
Create a new instance and pass in a single HTML element (not a jQuery object)
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
  
  // say if mouse and touch events are attached to the element, default is true. 
  // false means the element will not respond to any user interaction
  attachevents: true,
  
  // say if the transformable element can be interacted with and can fire events, default is true.
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
  type: 'rotator-box',
  
  // internal option to specify another Transformable instance to receive the transform. Do not use
  // it is used to make rotate handles work
  rotatetarget: instanceofTransformable
  
}
```
## Methods
Methods are chainable so you can call one then another.

### `.zoom(dir)`
```
// make bigger by 5%
myref.zoom(1);

// make smaller by 5% 
myref.zoom(-1);

// make bigger by 15%. Each whole number is 5%
myref.zoom(3);
```
This will zoom the element centrally within its parent element. Meaning the centre of the parent element will be the origin of the zoom. The parent element must have a height and width. 
### `.scale(origin, amount)`
```
// Make 50% bigger from point 50, 100. Origin point is relative to top left 
// of the element before any transformations are applied. Nothing to do with 
// window/viewport coordinates
myref.scale(new Point(50, 100), 1.5);
```
### `.translate = function (x, y[, transition])`
```
// translate left 50px and down 100px with smooth transition
myref.translate(50, 100);

// translate left 50px and down 100px but don't use a smooth transition
myref.translate(50, 100, false);
```
### `.rotate(origin, degrees, transition[, relativeToWindow])`
```
// rotate 45 degrees clockwise with smooth transition
myref.rotate(new Point(0, 0), 45, true);

// Same but, rotated around the centre of the element
myref.rotate(null, 45, true);
```
Positive values for `degrees` will be clockwise rotations, negative will be anticlockwise
### `.straighten()`
```
myref.straighten()
```
Undo the rotation making the element horizontal.
### `.fittoparent()`
```
myref.fittoparent();
```
The element will be scaled, centred and straightened so it fits entirely within its parent element.  
### `filltoparent()`
```
myref.filltoparent();
```
The element will be scaled, centred and straightened so no background of the parent element can be seen.
### `.setTransition(bool)`
```
// turn off transitions. Transformation will not be smooth
myref.setTransition(false);

// turn on transitions. Transformation will be smooth
myref.setTransition(true);
```
### `.snapRotation()`
```
// turn off transitions. Transformation will not be smooth
myref.snapRotation();
```
If the element rotation is within 3 degrees of a multiple of 15, the rotation will snap to that multiple. I.e. 45, 60, 75, 90 degrees. 
### `.centreinparent([transition, parents])`
```
// Centre element within its parent element. Use smooth transition.
myref.centreinparent();

// Centre element within its parent element. No transition.
myref.centreinparent(false);
```
The second argument `parents` is included for internal optimisations, it is rarely useful.
### `.pointInRectangle(p, a, b, c, d)`
```
// see if Point p is within the polygon defined with corner points a, b, c, d
myref.pointInRectangle(p, a, b, c, d);
```
returns `{ ok: true}` or `{ ok: false }` all arguments should be instances of Point
### `.trigger(eventType[, eventObject])`
```
myref.trigger('stop');
```
Trigger a named event and optionaly pass in an event object.
### `.getRotationQuadrant(angle)`
```
myref.getRotationQuadrant(35);
```
Returns `{ Angle: angle, Horiz: bool, Vert: bool, Quad: number }` Quadrants are numbered from 0 to 3 in clockwise direction.

## Undo / Redo History
### `.reset([transition])`
```
myref.reset();
```
The transform will be reset to the initial CSS transform (if there was one) or undo all transformations.
### `.undo([snapshotKey])`
```
// undo last transformation/interaction by user
myref.undo();

// Go back to a named snapshot.
myref.undo('namehere');
```
If you provide a string as first argument, and there is a matching snapshot in the undo stack, you can revert to that previous state.
### `.redo()`
```
// redo last undone transformation/interaction
myref.redo();
```
### `.hasHistoryKey(snapshotKey)`
```
myref.hasHistoryKey('myKey')
```
If the undo stack contains a matching snapshot, returns `true` otherwise `false`.
### `.matrix.save(snapshotKey)`
```
// create a snapshot
myref.matrix.save('mySnapshot')
```
Saving a snapshot is done using the `save` method on the Transformable's matrix property.
