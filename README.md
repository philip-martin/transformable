# transformable

Transformable is a vanilla javascript library for adding translation (panning), scaling (zoom) and rotation to HTML elements by manipulating a 2D CSS transformation matrix.

It works with mouse and touch events to scale, rotate or move elements. You can use pinch gestures and mouse wheel too. 

Rotation handles allow you to rotate around the centre of the element (initially) or you can move the rotation handle somewhere else to rotate about another point. Resize handles can also be dragged to change the elements width/height.

Transformable elements can be nested within each other and the depth/position/offset in the node hierarchy won't matter. 

You also get undo/redo history and can save snapshots to go to specific named transform states.

View the [Demo](https://philip-martin.github.io/transformable/solution/demo/index.html) to see how flexible it can be.

## Loading

You just need to include the stylesheet and one javascript file:
```Html
<link rel="stylesheet" href="/css/transformable.css" />
<script src="/js/transformable.js"></script>
```
There is a minified version created with uglifyjs (48Kb). 

## Usage
Create a new instance and pass in a single HTML element (not a jQuery object)
```JavaScript
var myref = new Transformable(document.getElementById('one'));

// pass options
var myref2 = new Transformable(document.getElementById('two'), { contain: 'enclose', resize:'tl-br' });
```
## Options
```JavaScript
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
  start: function(element, event) { /* this will be the Transformable instance */ },
  
  // on move event. Try not to use this for anything other than basic stuff. The event will fire
  // many, many times per second
  move: function(element, event) { /* this will be the Transformable instance */ },
  
  // on stop event.
  stop: function(element, event) { /* this will be the Transformable instance */ },
  
  // on tap/click
  tap: function(element, event) { /* this will be the Transformable instance */ },
  
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
  
  // internal option to specify another Transformable instance to receive the transform.
  // it is used to make rotate handles work
  rotatetarget: instanceofTransformable
  
}
```
## Methods
Methods are chainable so you can call one then another.

### `.zoom(dir)`
```JavaScript
// make bigger by 5%
myref.zoom(1);

// make smaller by 5% 
myref.zoom(-1);

// make bigger by 15%. Each whole number is 5%
myref.zoom(3);
```
This will zoom the element centrally within its parent element. Meaning the centre of the parent element will be the origin of the zoom. The parent element must have a height and width. 
### `.scale(origin, amount)`
```JavaScript
// Make 50% bigger 
myref.scale(new Point(50, 100), 1.5);
```
First argument should be an instance of `Point` and is used as the origin for the scaling. The coordinates of the point are relative to top left of the element **before** any transformations are applied. It is not the window/viewport pixels.
### `.translate(x, y[, transition])`
```JavaScript
// translate left 50px and down 100px with smooth transition
myref.translate(50, 100);

// translate left 50px and down 100px but don't use a smooth transition
myref.translate(50, 100, false);
```
`x` and `y` are relative to the top left of the element before any transformation is applied. It is not the window/viewport pixels. 
### `.rotate(origin, degrees, transition[, relativeToWindow])`
```JavaScript
// rotate 45 degrees clockwise with smooth transition
myref.rotate(new Point(0, 0), 45, true);

// Same but, rotated around the centre
myref.rotate(null, 45, true);
```
Supply `null` as the first argument to rotate around the centre of the element. Positive values for `degrees` will be clockwise rotations, negative will be anticlockwise
### `.straighten()`
```JavaScript
myref.straighten()
```
Undo the rotation making the element horizontal.
### `.fittoparent()`
```JavaScript
myref.fittoparent();
```
The element will be scaled, centred and straightened so it fits entirely within its parent element.  
### `filltoparent()`
```JavaScript
myref.filltoparent();
```
The element will be scaled, centred and straightened so no background of the parent element can be seen.
### `.setTransition(bool)`
```JavaScript
// turn off transitions. Transformation will not be smooth
myref.setTransition(false);

// turn on transitions. Transformation will be smooth
myref.setTransition(true);
```
### `.snapRotation()`
```JavaScript
// turn off transitions. Transformation will not be smooth
myref.snapRotation();
```
If the element rotation is within 3 degrees of a multiple of 15, the rotation will snap to that multiple. I.e. 45, 60, 75, 90 degrees. 
### `.centreinparent([transition, parents])`
```JavaScript
// Centre element within its parent element. Use smooth transition.
myref.centreinparent();

// Centre element within its parent element. No transition.
myref.centreinparent(false);
```
The second argument `parents` is included for internal optimisations, it is rarely useful.
### `.pointInRectangle(p, a, b, c, d)`
```JavaScript
// see if Point p is within the polygon defined with corner points a, b, c, d
myref.pointInRectangle(p, a, b, c, d);
```
returns `{ ok: true}` or `{ ok: false }` all arguments should be instances of Point
### `.trigger(eventType[, eventObject])`
```JavaScript
myref.trigger('stop');
```
Trigger a named event and optionaly pass in an event object.
### `.getRotationQuadrant(angle)`
```JavaScript
myref.getRotationQuadrant(35);
```
Returns `{ Angle: angle, Horiz: bool, Vert: bool, Quad: number }` Quadrants are numbered from 0 to 3 in clockwise direction.

## Undo & Redo
### `.reset([transition])`
```JavaScript
myref.reset();
```
The transform will be reset to the initial CSS transform (if there was one) or undo all transformations.
### `.undo([snapshotKey])`
```JavaScript
// undo last transformation/interaction by user
myref.undo();

// Go back to a named snapshot.
myref.undo('namehere');
```
If you provide a string as first argument, and there is a matching snapshot in the undo stack, you can revert to that previous state.
### `.redo()`
```JavaScript
// redo last undone transformation/interaction
myref.redo();
```
### `.hasHistoryKey(snapshotKey)`
```JavaScript
myref.hasHistoryKey('myKey')
```
If the undo stack contains a matching snapshot, returns `true` otherwise `false`.
### `.matrix.save(snapshotKey)`
```JavaScript
// create a snapshot
myref.matrix.save('mySnapshot')
```
Saving a snapshot is done using the `save` method on the Transformable's matrix property.
## Ancestry `.Ancestry`;
Each instance of Transformable has an `.Ancestry` property. The Ancestry class records the CSS transform of the transformable element and all parent elements higher up in the node hierarchy. It deals with scroll position and converts any CSS, that would change an element's position or offset, to a 2D matrix and stores it in an array. From that array of parent matrices, it can calculate the exact position of any click or touch on the element, however the element or its parents have been transformed or positioned. 

The transform origin is always `0, 0`.
