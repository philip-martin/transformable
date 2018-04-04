// Wheel event polyfill
(function (window, document) {
 
    var prefix = "", _addEventListener, support;

    // detect event model
    if ( window.addEventListener ) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // detect available wheel event
    support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
                document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

    window.addWheelListener = function( elem, callback, useCapture ) {
        _addWheelListener( elem, support, callback, useCapture );

        // handle MozMousePixelScroll in older Firefox
        if( support == "DOMMouseScroll" ) {
            _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
        }
    };

    function _addWheelListener( elem, eventName, callback, useCapture ) {
        elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
            !originalEvent && ( originalEvent = window.event );

            // create a normalized event object
            var event = {
                // keep a ref to the original event object
                originalEvent: originalEvent,
                target: originalEvent.target || originalEvent.srcElement,
                type: "wheel",
                deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                deltaX: 0,
                deltaY: 0,
                deltaZ: 0,
                preventDefault: function() {
                    originalEvent.preventDefault ?
                        originalEvent.preventDefault() :
                        originalEvent.returnValue = false;
                },
                stopPropagation: function () {
                    originalEvent.stopPropagation ?
                        originalEvent.stopPropagation() :
                        originalEvent.returnValue = false;
                }
            };
            
            // calculate deltaY (and deltaX) according to the event
            if ( support == "mousewheel" ) {
                event.deltaY = - 1/40 * originalEvent.wheelDelta;
                // Webkit also support wheelDeltaX
                originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
            } else {
                event.deltaY = originalEvent.detail;
            }

            // it's time to fire the callback
            return callback( event );

        }, useCapture || false );
    }

})(window, document);

var Transformable = function (el, opts) {
    opts = opts || {}
    if (el.length)
        el = el[0];
    this.options = opts;
    this.element = el;
    this.element.classList.add('transformable');
    this.parent = el.parentNode;

    this.setInitialSizes();

    if (opts && opts.matrix) {
        var cscale = { x:1, y:1 }
        if (opts.computedsize && (opts.computedsize.width || opts.computedsize.Width)) {
            // we have a size to compare current computed size with
            // translation is in local pixels, and depends on current size of element in local pixels
            // if the current computed size is different, the translation will need 
            // to be scaled so design looks the same when drawn at some other size
            var precs = {
                width: opts.computedsize.width || opts.computedsize.Width,
                height: opts.computedsize.height || opts.computedsize.Height
            }
            var curcs = this.sizes.element.initial;
            cscale.x = curcs.width / precs.width;
            cscale.y = curcs.height / precs.height;
        }
        if (opts.matrix instanceof Array && opts.matrix.length == 6) {
            opts.matrix[4] *= cscale.x;
            opts.matrix[5] *= cscale.y;
            this._setMatrix(new Matrix(opts.matrix));
        } else if (opts.matrix instanceof Matrix) {
            opts.matrix.elements[4] *= cscale.x;
            opts.matrix.elements[5] *= cscale.y;
            this._setMatrix(opts.matrix);
        }
    }
    this.matrix = this._getMatrix();
    this.originalTransition = this._getOriginalTransition();
    this.Ancestry = new Ancestry(this);

    this._setOffset();

    this.Ancestry._setoffset();

    this.dragging = false; //
    this.start = null;
    this.orig = null;
    this.zooma = 0.001; 

    this.events = { 
        start: opts.start,
        move: opts.move,
        stop: opts.stop,
        tap: opts.tap,
        transition: opts.transition
    }

    this.element.setAttribute('data-transformable-id', Transformable.Instance.push(this) - 1);
    if(navigator.userAgent.indexOf('Edge') == -1)
        this.element.setAttribute('draggable', false);

    if ((typeof opts.attachevents == 'undefined' || opts.attachevents === true) && opts.editable !== false) {
        this._addEvents();

        if (opts.resize) 
            this.createResizeHandles(opts.resize);

        if (!opts.disable || opts.disable && !opts.disable.rotate) 
            this.createRotateHandles();

        if (opts.handle && opts.type == 'rotator-box') 
            this._addRotateEvents(opts.handle);
    }

    //window.lastTransformable = this;
}
Transformable.Instance = [];
Transformable.prototype._getOriginalTransition = function () {
    var t = getComputedStyle(this.element)['transition'], sa = t.split(','), r = [];
    for (var i in sa) {
        if (sa[i].indexOf('transform ') == -1)
            r.push(sa[i]);
    }
    return r.join(',');
}
Transformable.prototype.tag = function (str) {
    var r = document.createElement('div');
    r.innerHTML = str;
    return r.firstChild;
}
Transformable.prototype.createRotateHandles = function (typ) {
    if ((!typ || typ == 'rotate')) {
        var box = this.tag('<div class="transformable-rotation-box"></div>'),
            rot = this.tag('<svg class="transformable-svg-rotator" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve"><g><circle style="fill:#00A8DF;" cx="48.3" cy="48" r="35.3"/><g><path style="fill:#FFFFFF;" d="M35.2,3.8l4.1,28.5c0.2,1.5,2,2.1,3,1l8.2-8.2c0.7-0.7,1.8-0.7,2.5,0l8.8,8.8c7.8,7.8,9.1,20.2,1.2,28.2l-10,10c-0.7,0.7-1.8,0.7-2.5,0L41,62.6c-1-1-2.8-0.4-3,1l-4.1,28.5c-0.2,1.2,0.8,2.2,2,2l28.5-4.1c1.5-0.2,2.1-2,1-3l-8.9-8.9c-0.7-0.7-0.7-1.8,0-2.5l10-10c9.8-9.8,8.5-25.6-1.2-35.2l-8.8-8.8c-0.7-0.7-0.7-1.8,0-2.5L66.7,8.9c1-1,0.4-2.8-1-3L37.2,1.8C36,1.6,35,2.6,35.2,3.8z"/><g style="opacity:0.5;"><path d="M36.9,1.8c0.1,0,0.2,0,0.3,0l28.5,4.1c1.5,0.2,2.1,2,1,3L56.6,19.1c-0.7,0.7-0.7,1.8,0,2.5l8.8,8.8c9.7,9.7,11,25.5,1.2,35.2l-10,10c-0.7,0.7-0.7,1.8,0,2.5l8.9,8.9c1,1,0.4,2.8-1,3l-28.5,4.1c-0.1,0-0.2,0-0.3,0c-1.1,0-1.9-1-1.8-2.1l4.1-28.5c0.1-1,0.9-1.5,1.8-1.5c0.4,0,0.9,0.2,1.3,0.5l9.5,9.5c0.4,0.4,0.8,0.5,1.3,0.5s0.9-0.2,1.3-0.5l10-10c8-8,6.7-20.3-1.2-28.2L53,25.2c-0.4-0.4-0.8-0.5-1.3-0.5s-0.9,0.2-1.3,0.5l-8.2,8.2c-0.4,0.4-0.8,0.5-1.3,0.5c-0.8,0-1.7-0.6-1.8-1.5L35.2,3.8C35,2.7,35.9,1.8,36.9,1.8 M36.9-0.2c-1.1,0-2.1,0.5-2.9,1.3c-0.7,0.8-1,1.9-0.9,3l4.1,28.5c0.3,1.9,1.9,3.3,3.8,3.3c1,0,2-0.4,2.7-1.1l8.1-8.1l8.7,8.7c7.4,7.4,8,18.6,1.2,25.3l-9.8,9.8l-9.3-9.3c-0.7-0.7-1.7-1.1-2.7-1.1c-1.9,0-3.5,1.4-3.8,3.3l-4.1,28.5c-0.2,1.1,0.2,2.2,0.9,3c0.7,0.8,1.8,1.3,2.9,1.3c0.2,0,0.4,0,0.5,0l28.5-4.1c1.4-0.2,2.6-1.2,3.1-2.6c0.5-1.4,0.1-2.9-0.9-3.9l-8.7-8.7l9.8-9.8c10.2-10.2,9.6-27.2-1.2-38.1l-8.7-8.7l10-10c1-1,1.4-2.5,0.9-3.9c-0.5-1.4-1.6-2.4-3.1-2.6L37.5-0.2C37.3-0.2,37.1-0.2,36.9-0.2L36.9-0.2z"/></g></g></g></svg>'),
            anc = this.tag('<svg class="transformable-svg-anchor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve"><g><circle style="fill:#00A8DF;" cx="47.6" cy="48.4" r="17.6"/><g><path style="fill:#FFFFFF;" d="M69,46H50V27.2c0-1.4-1.1-2.4-2.5-2.4S45,25.9,45,27.2V46H26.6c-1.4,0-2.4,1.1-2.4,2.5s1.1,2.5,2.4,2.5H45v18.6c0,1.4,1.1,2.4,2.5,2.4s2.5-1.1,2.5-2.4V51h19c1.4,0,2.4-1.1,2.4-2.5S70.3,46,69,46z"/><g style="opacity:0.5;"><path d="M47.5,24.8c1.4,0,2.5,1.1,2.5,2.4V46h19c1.4,0,2.4,1.1,2.4,2.5c0,1.4-1.1,2.5-2.4,2.5H50v18.6c0,1.4-1.1,2.4-2.5,2.4S45,70.9,45,69.6V51H26.6c-1.4,0-2.4-1.1-2.4-2.5c0-1.4,1.1-2.5,2.4-2.5H45V27.2C45,25.9,46.1,24.8,47.5,24.8 M47.5,22.8c-2.5,0-4.5,2-4.5,4.4V44H26.6c-2.5,0-4.4,2-4.4,4.5c0,2.5,2,4.5,4.4,4.5H43v16.6c0,2.5,2,4.4,4.5,4.4s4.5-2,4.5-4.4V53h17c2.5,0,4.4-2,4.4-4.5c0-2.5-2-4.5-4.4-4.5H52V27.2C52,24.8,50,22.8,47.5,22.8L47.5,22.8z"/></g></g></g></svg>'),
            lin = this.tag('<div class="transformable-rotation-line"></div>'),
            that = this;


        box.appendChild(lin);
        box.appendChild(anc);
        box.appendChild(rot);
        box.appendChild(this.tag('<div class="transformable-anchor-point"></div>'));

        if(this.element.nodeName=='IMG')
            this.parent.appendChild(box);
        else
            this.element.appendChild(box);

        // stops clicks from parent elements, can't cancel clicks in a mouseup
        box.addEventListener('click', function (e) { e.stopPropagation(); return false; });

        this.rotatorBox = new Transformable(box, { type: 'rotator-box', rotatetarget: this, handle: rot, disable: { zoom: true, rotate: true, resize: true } });

        var
        _domouseup = function () {
            if (that.rotatorBox)
                if(that.rotatorBox.parent)
                    that.rotatorBox.parent.classList.remove('transformable-mousedown');

            var body = document.querySelector('body');
            that.off(body, 'mouseup.rotatormouse')
        },
        _domousedown = function () {
            this.classList.add('transformable-mousedown');
            var body = document.querySelector('body');
            that.on(body, 'mouseup.rotatormouse', _domouseup)
        },
        _domouseleave = function () {
            if (that._overTimer)
                clearTimeout(that._overTimer);

            //var rb;
            //if (rb = that.rotatorBox) {
            //    rb.translate(8000, 0, false);
            //}
            that._resizeTimer = setTimeout(function () {
                that.element.classList.remove('transformable-resize-over');
            }, 500);

            this.classList.remove('transformable-over-active');
            this.classList.remove('transformable-over');
        },
        _domouseenter = function (tim) {
            if (tim.stopPropagation)
                tim.stopPropagation();

            if (that._resizeTimer)
                clearTimeout(that._resizeTimer);

            this.classList.add('transformable-over');
            this.classList.add('transformable-resize-over');

            that.Ancestry.Items.forEach(function (v, i) {
                if (v._overTimer)
                    clearTimeout(v._overTimer);
            });

            that._overTimer = setTimeout(function () {
                var
                    rb = that.rotatorBox,
                    anc = rb.Ancestry, 
                    pt = anc.FirstParent(), 
                    ds = 1;
                /*
                 * something to try and scale the handles displayed inside the transformable element
                 * so they dont look huge when a parent element is scaled 
                 * not really working as I wanted
                 * 
                if (pt)
                    ds = 1 / pt.matrix.scaling();

                if (rb) {
                    var tsc = rb.matrix.scaling();
                    if (rb.dragging || rb.draggingrotate)
                        return;

                    rb.scale(new Point(0), ds * (1/tsc), false);
                }
                if (tlb && brb)
                {
                    tlb.style.transform = 'scale(' + ds + ')';
                    brb.style.transform = 'scale(' + ds + ')';
                }
                */
                if(parseFloat(getComputedStyle(rb.element).width) >= 32)
                    rb.parent.classList.add('transformable-over-active');

                var l = anc.Items.length;
                anc.Items.forEach(function (v, i) {
                    if (i < l-2) {
                        v.element.classList.remove('transformable-over-active');
                    }
                })

            }, typeof(tim) == 'number' ? tim : 1500);

        };

        var rotparent = this.rotatorBox.parent;

        this.on(rotparent, 'mouseenter.rotatormouse', _domouseenter);
        this.on(rotparent, 'mouseleave.rotatormouse', _domouseleave);
        this.on(rotparent, 'mousedown.rotatormouse', _domousedown);
        this.on(rotparent, 'click.rotatormouse', function () { _domouseenter.apply(this, [0]); });
    }
}
Transformable.prototype.createResizeHandles = function (typ) {
    // hard coded svg elements. Sorry
    if (typ == 'tl-br') {
        var
            tl = this.tag('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-271 394.9 52 52" style="enable-background:new -271 394.9 52 52;" xml:space="preserve"><g><path style="fill:#00A8DF;" d="M-244.9,421L-244.9,421L-244.9,421L-244.9,421L-244.9,421l26,0.1c0-10.8-6.1-20-16-24.1 c-10-4.1-20.8-2-28.4,5.7c-7.6,7.6-9.7,18.5-5.6,28.4c4.2,10,13.4,16,24.2,15.9L-244.9,421z"/><path style="fill:none;stroke:#FFFFFF;stroke-width:3;" d="M-251.6,414.3"/><path style="fill:none;stroke:#FFFFFF;stroke-width:3;" d="M-236.6,414.3"/></g><g><path style="fill:#FFFFFF;" d="M-227,419.5l-7.6-4.4c-1.1-0.6-2.4,0.2-2.4,1.4v1.9h-5.6v-5.5h2c1.2,0,2-1.3,1.4-2.4l-4.4-7.6 c-0.6-1.1-2.1-1.1-2.7,0l-4.4,7.6c-0.6,1.1,0.2,2.4,1.4,2.4h2v5.5h-5.6v-1.9c0-1.2-1.3-2-2.4-1.4l-7.6,4.4c-1.1,0.6-1.1,2.1,0,2.7 l7.6,4.4c1.1,0.6,2.4-0.2,2.4-1.4v-2h5.6v5.6h-2c-1.2,0-2,1.3-1.4,2.4l4.4,7.6c0.6,1.1,2.1,1.1,2.7,0l4.4-7.6 c0.6-1.1-0.2-2.4-1.4-2.4h-2v-5.6h5.6v2c0,1.2,1.3,2,2.4,1.4l7.6-4.4C-225.9,421.7-225.9,420.1-227,419.5z"/><path style="opacity:0.5;fill:#231F20;" d="M-245,402.1c0.5,0,1.1,0.3,1.4,0.8l4.4,7.6c0.6,1.1-0.2,2.4-1.4,2.4h-2v5.5h5.6v-1.9 c0-0.9,0.8-1.6,1.6-1.6c0.3,0,0.5,0.1,0.8,0.2l7.6,4.4c1.1,0.6,1.1,2.1,0,2.7l-7.6,4.4c-0.3,0.1-0.5,0.2-0.8,0.2 c-0.8,0-1.6-0.7-1.6-1.6v-2h-5.6v5.6h2c1.2,0,2,1.3,1.4,2.4l-4.4,7.6c-0.3,0.5-0.8,0.8-1.4,0.8c-0.5,0-1.1-0.3-1.4-0.8l-4.4-7.6 c-0.6-1.1,0.2-2.4,1.4-2.4h2v-5.6h-5.6v2c0,0.9-0.8,1.6-1.6,1.6c-0.3,0-0.5-0.1-0.8-0.2l-7.6-4.4c-1.1-0.6-1.1-2.1,0-2.7l7.6-4.4 c0.3-0.1,0.5-0.2,0.8-0.2c0.8,0,1.6,0.7,1.6,1.6v1.9h5.6v-5.5h-2c-1.2,0-2-1.3-1.4-2.4l4.4-7.6C-246.1,402.3-245.5,402.1-245,402.1 M-245,400.6c-1.1,0-2.1,0.6-2.6,1.5l-4.4,7.6c-0.5,0.9-0.5,2.1,0,3c0.5,0.9,1.5,1.5,2.6,1.5h0.5v2.7h-2.7v-0.5c0-1.7-1.4-3-3-3 c-0.5,0-1,0.1-1.5,0.4l-7.6,4.4c-0.9,0.5-1.5,1.5-1.5,2.6c0,1.1,0.6,2.1,1.5,2.6l7.6,4.4c0.5,0.3,1,0.4,1.5,0.4c1.7,0,3-1.4,3-3	v-0.6h2.7v2.8h-0.5c-1.1,0-2.1,0.6-2.6,1.5c-0.5,0.9-0.5,2.1,0,3l4.4,7.6c0.5,0.9,1.5,1.5,2.6,1.5c1.1,0,2.1-0.6,2.6-1.5l4.4-7.6 c0.5-0.9,0.5-2.1,0-3c-0.5-0.9-1.5-1.5-2.6-1.5h-0.5v-2.8h2.7v0.6c0,1.7,1.4,3,3,3c0.5,0,1-0.1,1.5-0.4l7.6-4.4	c0.9-0.5,1.5-1.5,1.5-2.6c0-1.1-0.6-2.1-1.5-2.6l-7.6-4.4c-0.5-0.3-1-0.4-1.5-0.4c-1.7,0-3,1.4-3,3v0.5h-2.7v-2.7h0.5	c1.1,0,2.1-0.6,2.6-1.5c0.5-0.9,0.5-2.1,0-3l-4.4-7.6C-242.9,401.2-243.9,400.6-245,400.6L-245,400.6z"/></g></svg>'),
            br = this.tag('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-271 394.9 52 52" style="enable-background:new -271 394.9 52 52;" xml:space="preserve"><g><path style="fill:#00A8DF;" d="M-245,420.9L-245,420.9L-245,420.9L-245,420.9L-245,420.9l-26-0.1c0,10.8,6.1,20,16,24.1 c10,4.1,20.8,2,28.4-5.7c7.6-7.6,9.7-18.5,5.6-28.4c-4.2-10-13.4-16-24.2-15.9L-245,420.9z"/></g><g><path style="fill:#FFFFFF;" d="M-245.8,423l-2.5-2.5l-2.1,2.1c-0.9,0.9-2.3,0.5-2.6-0.7l-1.6-9.2c-0.3-1.2,0.8-2.3,1.9-1.9l9.2,1.6 c1.2,0.3,1.6,1.8,0.7,2.6l-2.1,2.1l2.5,2.5l2.7,2.7l-1-1l2.1-2.1c0.9-0.9,2.3-0.5,2.6,0.7l1.6,9.2c0.3,1.2-0.8,2.3-1.9,1.9 l-9.2-1.6c-1.2-0.3-1.6-1.8-0.7-2.6l2.1-2.1l-3.2-3.2L-245.8,423z"/><path style="opacity:0.5;fill:#231F20;" d="M-239.6,422.3l-1-1l2.1-2.1c0.7-0.7,1.7-0.6,2.2,0c0.2,0.2,0.3,0.4,0.4,0.7l1.6,9.2 c0.3,1.2-0.8,2.3-1.9,1.9l-9.2-1.6c-0.3-0.1-0.5-0.2-0.7-0.4c-0.6-0.6-0.7-1.6,0-2.2l2.1-2.1l-3.2-3.2l1.5,1.5l-2.5-2.5l-2.1,2.1 c-0.7,0.7-1.7,0.6-2.2,0c-0.2-0.2-0.3-0.4-0.4-0.7l-1.6-9.2c-0.3-1.2,0.8-2.3,1.9-1.9l9.2,1.6c0.3,0.1,0.5,0.2,0.7,0.4 c0.6,0.6,0.7,1.6,0,2.2l-2.1,2.1l2.5,2.5L-239.6,422.3z M-242.3,417.5l-0.5-0.5l1-1c1.2-1.2,1.2-3.1,0-4.3 c-0.4-0.4-0.8-0.6-1.4-0.8l-9.2-1.6c-1.1-0.3-2.1,0-2.9,0.8c-0.8,0.8-1.1,1.9-0.8,2.9l1.6,9.2c0.1,0.5,0.4,1,0.8,1.4 c1.2,1.2,3.1,1.2,4.3,0l1.1-1.1l0.5,0.5l0.5,0.5l1.2,1.2l-1.1,1.1c-1.2,1.2-1.2,3.1,0,4.3c0.4,0.4,0.8,0.6,1.4,0.8l9.2,1.6 c1.1,0.3,2.1,0,2.9-0.8c0.8-0.8,1.1-1.9,0.8-2.9l-1.6-9.2c-0.1-0.5-0.4-1-0.8-1.4c-1.2-1.2-3.1-1.2-4.3,0l-1,1l-1.2-1.2"/></g></svg>');
        var
            tlb = this.tag('<div class="transformable-resize-button"></div>'),
            brb = tlb.cloneNode();

        tlb.classList.add('tl');
        tlb.appendChild(tl);
        brb.classList.add('br');
        brb.appendChild(br);

        this.resizertl = tlb;
        this.resizerbr = brb;

        this.element.appendChild(tlb);
        this.element.appendChild(brb);
        this._addResizeEvents(tlb, brb);
    }
}
Transformable.prototype.zoom = function (dir) {
    var offset = this.Ancestry.OffsetFromPoint(this._findCentreInWindow());
    this.scale(offset, 1 + dir * 0.05);

    return this;
}
Transformable.prototype.scale = function (p, s) {
    this.matrix.scale(p, s);
    this.setTransition(true);
    this._updateElement();
    //this.trigger('stop');
    return this;
}
Transformable.prototype.translate = function (x,y, transition) {
    this.matrix.translate(x, y);
    this.setTransition(transition);
    this._updateElement();
    //this.trigger('stop');
    return this;
}
Transformable.prototype.rotate = function (p, a, trans, inwindow) {
    if (!(p instanceof Point) || !p || typeof p == 'undefined') 
        p = this.Ancestry.OffsetFromPoint(this._findCentreInWindow());

    if (p instanceof Point && inwindow)
        p = this.Ancestry.OffsetFromPoint(p);

    this.matrix.rotate(p, a);
    this.lastrotationpoint = p;
    if (typeof trans == 'undefined' || trans === false)
        this.setTransition(false);

    this._updateElement();
    return this;
}
Transformable.prototype.straighten = function () {
    var r = this.matrix.rotation();
    this.rotate(new Point(this.sizes.element.initial.width / 2, this.sizes.element.initial.height / 2), -r, true);
    return this;
}
Transformable.prototype.fittoparent = function () {
    var sz = new Point(this.sizes.element.initial.width, this.sizes.element.initial.height),
        anc = this.Ancestry,
        pars = anc.GetParents(),
        parentT = anc.FirstParent(),
        pr = parentT.rect,
        m = this.matrix.inverse(),
        tl = m.transformpoint(pr.topleft),
        tr = m.transformpoint(pr.topright),
        bl = m.transformpoint(pr.bottomleft),
        br = m.transformpoint(pr.bottomright),
        psiz = new Point(this._distanceBetweenPoints(tl, tr), this._distanceBetweenPoints(tl, bl));

    var sc = psiz.divide(sz), scale = Math.min(sc.x, sc.y);
    this.scale(new Point(0, 0), scale);
    this.centreinparent(true, pars);
    this.straighten();

    return this;
}
Transformable.prototype.filltoparent = function (el) {
    var sz = new Point(this.sizes.element.initial.width, this.sizes.element.initial.height),
    anc = this.Ancestry,
    pars = anc.GetParents(),
    parentT = anc.FirstParent(),
    pr = parentT.rect,
    m = this.matrix.inverse(),
    tl = m.transformpoint(pr.topleft),
    tr = m.transformpoint(pr.topright),
    bl = m.transformpoint(pr.bottomleft),
    br = m.transformpoint(pr.bottomright),
    psiz = new Point(this._distanceBetweenPoints(tl, tr), this._distanceBetweenPoints(tl, bl));

    var sc = psiz.divide(sz),
        scale = Math.max(sc.x, sc.y);
    
    this.scale(new Point(0, 0), scale);
    this.centreinparent(true, pars);
    this.straighten();

    return this;
}
Transformable.prototype._getRect = function (el) {
    return el.getBoundingClientRect();
}
Transformable.prototype.reset = function (trans) {
    if (!this.InitialMatrix)
        this.matrix.reset();
    else
        this.matrix.elements = this.InitialMatrix.slice(0);

    //this.off(this.element, 'transitionstart.reset');

    this.setTransition(typeof trans == 'undefined' ? true : trans);
    if (this.transition) {
        var that = this;

        if (this.delta && (this.delta.x || this.delta.y)) { // has moved so will transition
            this.element.classList.add('transformable-reset');
            this.on(this.element, 'transitionend.reset', function () {
                this.classList.remove('transformable-reset');
                that.off(this, 'transitionend.reset');
            });
        }
        // unsupported !
        //this.on(this.element, 'transitionstart.reset', function () {
        //    this.classList.add('transformable-reset');
        //    that.off(this, 'transitionstart.reset');
        //});
    }
    this._updateElement();
    return this;
}
Transformable.prototype.hasHistoryKey = function (k) {
    return this.matrix.history.undo[k] instanceof Array;
}
Transformable.prototype.undo = function (k) {
    this.matrix.undo(k);
    this.setTransition(true);
    this._updateElement();
    return this;
}
Transformable.prototype.redo = function () {
    this.matrix.redo();
    this.setTransition(true);
    this._updateElement();
    return this;
}
Transformable.prototype.setInitialSizes = function () {
    if (this.sizes) return;
    var
        cs = window.getComputedStyle(this.element),
        w = parseFloat(cs.width),
        h = parseFloat(cs.height),
        l = parseFloat(cs.left),
        t = parseFloat(cs.top); //,
    
    this.sizes = {
        element: {
            initial: {
                offset: new Point(l, t),
                width: w,
                height: h,
                topleft: new Point(0, 0),
                topright: new Point(w, 0),
                bottomright: new Point(w, h),
                bottomleft: new Point(0, h)
            }
        },
        window: { width: parseFloat(getComputedStyle(document.body.parentNode).width) }
    }
}
Transformable.prototype._getOffset = function (el, setParentDims) {
    var cr = this._getRect(el), scroll = this.Ancestry._getScroll(); 
    
    var cs = getComputedStyle(el),
        pos = new Point(parseFloat(cs.left), parseFloat(cs.top)),
        os = new Point(cr.left + scroll.x, cr.top + scroll.y),
        br = new Point(cr.right, cr.bottom),
        tr = new Point(cr.right, cr.top),
        bl = new Point(cr.left, cr.bottom);

    return { offset: os, topleft: os, bottomright: br, topright: tr, bottomleft: bl, pos: pos  };
}
Transformable.prototype._setOffset = function () {
    // first init 
    if (!this.offset) {
        var too = this._getOffset(this.element, true); 

        this.offset = too.offset;
        this.initialoffset = too.offset;
        return;
    }
}
Transformable.prototype._getParentMatrix = function () {
    var par = this.element.parentElement.closest('.transformable'); // Element.closest returns itself if matched by the selector
    if(par==null)
        this.parentmatrix = Matrix.Identity();
    else
        this.parentmatrix = this._getMatrix(par);

    return this.parentmatrix
}
Transformable.prototype._cssStringToArray = function (t) {
    var m = t.match(/[0-9e., -]+/)[0].split(", ");
    m.forEach(function (v,i) {
        m[i] = parseFloat(v);
    });
    return m;
}
Transformable.prototype._arrayToCssString = function (a) {
    return 'matrix(' + a.join(',') + ')'
}

Transformable.prototype._getMatrix = function (el) {
    var elem = el || this.element,
        cs = getComputedStyle(elem),
        pcs = getComputedStyle(this.parent),
        t = cs.transform,
        top = cs.top.indexOf('%') > -1 ? parseFloat(pcs.height)*parseFloat(cs.top)/100 : parseFloat(cs.top), // ios safari bug
        left = cs.left.indexOf('%') > -1 ? parseFloat(pcs.width)*parseFloat(cs.left)/100 : parseFloat(cs.left), // ios safari bug
        margintop = parseFloat(cs.marginTop),
        marginleft = parseFloat(cs.marginLeft),
        bordertop = parseFloat(cs.borderTopWidth),
        borderleft = parseFloat(cs.borderLeftWidth),
        m, hasone = /matrix\(\-?[0-9]+[^\)]+\)/.test(t);

    if (hasone) {
        var m = this._cssStringToArray(t);
        if (!this.InitialMatrix)
            this.InitialMatrix = m.slice(0);
    }
    m = new Matrix(m || [1, 0, 0, 1, 0, 0]);
    var isrb = this.options.type == 'rotator-box';
    if (left || top || margintop || marginleft || bordertop || borderleft) {
        m.translate(left || 0, top || 0);
        m.translate(marginleft || 0, margintop || 0);
        m.translate(borderleft || 0, bordertop || 0);
        elem.style.marginTop = 0;
        elem.style.marginLeft = 0;
        elem.style.top = 0;
        elem.style.left = 0;
        elem.style.marginTop = (-(bordertop || 0)) + 'px';
        elem.style.marginLeft = (-(bordertop || 0)) + 'px';

        this.matrix = m;
        this._updateElement();

        this.InitialMatrix = m.elements.slice(0);
    }
    return m;
}
Transformable.prototype.setTransition = function (bool) {
    if(typeof bool == 'boolean') {
        var was = this.transition,
            cur = this.originalTransition,
            spl = cur ? cur.split(','): [];

        if(bool == true) {
            if (was != bool) {
                spl.push('transform 0.5s');
                this.element.style.transition = spl.join(',');
            }
        } 
        if(bool == false) {
            if (was != bool) {
                spl.push('transform 0s');
                this.element.style.transition = spl.join(',');
            }
        } 
        this.transition = bool;
    }
}
Transformable.prototype._updateElement = function () {
    var m = this.matrix, mtx = 'matrix(' + m.elements.join(',') + ')';

    this.element.style.transform = mtx;
}
Transformable.prototype._pushhistory = function () {
    this.matrix.save();
}
Transformable.prototype._setMatrix = function (m) {
    this.matrix = m;
    this._updateElement(m);
}

Transformable.prototype._getPageXY = function (e, touches) {
    var xy, ang, p1, p2;
    if (touches)
        if (touches.length == 2) {
            xy = this._getMiddle(touches);
            ang = this._getRotation(touches);
            p1 = new Point(touches[0].pageX, touches[0].pageY);
            p2 = new Point(touches[1].pageX, touches[1].pageY);
        }
        else {
            xy = (new Point(touches[0].pageX, touches[0].pageY));
            ang = this.matrix.rotation();
        }
    else {
        xy = (new Point(e.pageX, e.pageY));
        ang = this.matrix.rotation();
    }
    return {
        point: xy,
        angle: ang,
        p1: p1,
        p2: p2
    };
}

Transformable.prototype._getPoint2 = function (e, touches) {
    var
        dat = this._getPageXY(e, touches), deltaXY = null,
        anc = this.Ancestry,
        pars = anc.GetParents(),
        op = anc.OffsetFromPoint(dat.point, pars),
        dist = dat.p1 && dat.p2 ?
            this._distanceBetweenPoints(
                anc.OffsetFromPoint(dat.p1, pars),
                anc.OffsetFromPoint(dat.p2, pars)
            ) : 0;

    if (typeof(e.deltaX) != 'undefined')
        deltaXY = new Point(e.deltaX, e.deltaY);
     
    return {
        offset: op, 
        pageXY: dat.point,
        pageX: dat.point.x,
        pageY: dat.point.y,
        angle: dat.angle,
        distance: dist,
        deltaXY: deltaXY
    };  
}
Transformable.prototype._distanceBetweenPoints = function (a, b) {
    var prop = a.pageX ? {x:'pageX', y:'pageX'} : {x:'x', y:'y'}
    return Math.sqrt(Math.pow(Math.abs(b[prop.x] - a[prop.x]), 2) + Math.pow(Math.abs(b[prop.y] - a[prop.y]), 2));
}
Transformable.prototype._getMiddle = function (touches) {
    var touch1 = touches[0];
    var touch2 = touches[1];
    var mx = ((touch2.pageX - touch1.pageX) / 2) + touch1.pageX;
    var my = ((touch2.pageY - touch1.pageY) / 2) + touch1.pageY;

    return new Point(mx, my);
};
Transformable.prototype._getDistance2 = function (touches, pars) {
    var anc = this.Ancestry;
    pars = pars || anc.GetParents();
    var t1 = anc.OffsetFromPoint(new Point(touches[0].pageX, touches[0].pageY), pars);
    var t2 = anc.OffsetFromPoint(new Point(touches[1].pageX, touches[1].pageY), pars);

    return this._distanceBetweenPoints(t1, t2);
}
Transformable.prototype._getRotation = function (touches, norm) {
    var r;

    r = Math.atan2((touches[0].pageY||touches[0].y) - (touches[1].pageY||touches[1].y), (touches[0].pageX||touches[0].x) - (touches[1].pageX||touches[1].x)) *180 / Math.PI;

    return norm ? this.matrix.normaldegree(r) : r;
};
Transformable.prototype.snapRotation = function () {
    if (this.options.disable && this.options.disable.rotate)
        return;

    var r = this.matrix.rotation(), m = r-(15*Math.round(r/15)), am = Math.abs(m), siz = this.sizes.element.initial;
    this.setTransition(true);

    if (am <= 3 && am > 0) {
        var pt = this.lastrotationpoint || new Point(siz.width / 2, siz.height / 2);
        this.rotate(pt, -m);
        this.lastlastrotationpoint = undefined;
        this._pushhistory();
    }
    var msg;
    r = this.matrix.rotation();
    switch (Math.abs(Math.round(r*10)/10)) {
        case 0:
        case 180:
            msg = 'Horizontal';
            break;
        case 90:
            msg = 'Vertical';
            break;
        default:
            msg = 'Rotation: ' + (Math.round(r*10)/10) + '&deg;';
    }
    this.showMessage(msg, 'sticky', 2000);
}
Transformable.prototype.showMessage = function (m, c, t) {
    console.log(m);
}
Transformable.prototype._findCentreInWindow = function () {
    var prect = this._getRect(this.parent);
    return new Point(prect.left + prect.width / 2, prect.top + prect.height / 2);
}
Transformable.prototype.centreinparent = function (transition, pars) {

    var was = this.transition, anc = this.Ancestry;
    this.setTransition(transition);

    pars = pars || anc.GetParents();

    var pcs = getComputedStyle(this.parent), parentCentre = new Point(parseFloat(pcs.width) / 2, parseFloat(pcs.height) / 2);
    var centreOnThis = this.matrix.inverse().transformpoint(parentCentre);

    this.translate( centreOnThis.sub(new Point(this.sizes.element.initial.width / 2, this.sizes.element.initial.height / 2)));
    this.setTransition(was);
}
Transformable.prototype.pointInRectangle = function(p, a, b, c, d) {
    var ab = b.sub(a),
        ap = p.sub(a),
        bc = c.sub(b),
        bp = p.sub(b),
        dot_abap = ab.dot(ap),
        dot_abab = ab.dot(ab),
        dot_bcbp = bc.dot(bp),
        dot_bcbc = bc.dot(bc);

    var r = {
        dot_abap: dot_abap,
        dot_abab: dot_abab,
        dot_bcbp: dot_bcbp,
        dot_bcbc: dot_bcbc,
        ok: 0 <= dot_abap && (Math.round(dot_abap * 10) / 10) <= (Math.round(dot_abab * 10) / 10) && 0 <= dot_bcbp && (Math.round(dot_bcbp*10)/10) <= (Math.round(dot_bcbc*10)/10)
    };

    return r;
}

Transformable.prototype.trigger = function (n, event) {
    if (typeof this.events[n] == "function")
        this.events[n].apply(this, [this.element, event]);
}
Transformable.prototype._getRotatorPoints = function (e, pars) {
    var rpoint,
        apoint = this.anchor.TL,
        touches = e.touches,
        anc = this.Ancestry;

    pars = pars || anc.GetParents();

    anc._setoffset();

    if (touches)
        rpoint = (new Point(touches[0].pageX, touches[0].pageY));
    else
        rpoint = (new Point(e.pageX, e.pageY));

    //console.log(apoint.add(anc.scroll));
    //console.log(rpoint);
    var angle = Math.round(this._getRotation([apoint.add(anc.scroll), rpoint], false) * 100)/100; //,
    //console.log(angle);

    return {
        deltaXY: null,
        offset: anc.OffsetFromPoint(rpoint, pars), 
        pageXY: rpoint,
        pageX: rpoint.x ,
        pageY: rpoint.y,
        angle: angle,
        distance: 0
   }; 
}
Transformable.prototype._addRotateEvents = function (hdl) {
    var that = this, handle = hdl;
    var
    _domove = function (e) {
        if (!that.startedrotate) return false;
        that.draggingrotate = true;
        e.preventDefault();
        e.stopPropagation();
        var touches = e.touches, doupdate = false;

        if(touches)
            if (touches.length == 2)
                return false

        var point = that._getRotatorPoints(e),
            orig = that.origrotate,
            start = that.startrotate,
            m = that.matrix;

        var delta = {
            angle: Math.round((point.angle - start.angle) * 100)/100,
        }

        if (delta.angle != 0) {
            if (that.parent != that.options.rotatetarget.element) {
                m.rotateAboutPoint(new Point(0), delta.angle);
                doupdate = true;
            }
            if (that.options.rotatetarget instanceof Transformable)
                that.options.rotatetarget.rotate(that.anchor.TL.add(that.Ancestry.scroll), delta.angle, false, true);
            
        }

        if(doupdate)
            that._updateElement(m);
                
        that.startrotate.angle = point.angle;
    },
    _dostop = function (e) {
        e.preventDefault();
        e.stopPropagation();

        that.element.classList.remove('transformable-active');

        that.startedrotate = false;
        that.draggingrotate = false;

        that.off(document.querySelector('body'), 'mouseup.transformable dragend.transformable', _dostop);

        if (that.options.rotatetarget instanceof Transformable) {
            if (that.options.rotatetarget.events.stop)
                that.options.rotatetarget.trigger('stop', e);

            that.options.rotatetarget.snapRotation();
        }
        if (that.events.stop)
            that.trigger('stop', e);

        that.snapRotation();
    };
    _dostart = function (e) {
        if (that.options.disabled === true)
            return false;
        if (that.startedresize)
            return false;
        if (document.querySelectorAll('.transformable-active').length == 0)
            that.element.classList.add('transformable-active');

        //if (that.options.rotatetarget instanceof Transformable) 
        //    that.options.rotatetarget.updatedims();

        //that.updatedims();

        var m = that.matrix;

        that.origrotate = {
            trans: new Point(m.elements[4], m.elements[5]),
            angle: m.rotation(true),
            scale: m.scaling(),
        };

        var touches = e.touches;
        if (touches && touches.length == 2)
            if (touches[0].target && touches[1].target)
                if (touches[0].target !== touches[1].target) {
                    console.log('Two active elements not supported');
                    return false;
                }

        that.anchor = that.anchor || {};
        that.anchor.clientRect = that._getRect(that.element.querySelector('.transformable-anchor-point'));
        that.anchor.TL = new Point(that.anchor.clientRect.left, that.anchor.clientRect.top);

        that.startrotate = that._getRotatorPoints(e);

        that.startrotate.scale = that.origrotate.scale;
        that.startedrotate = true;
        that.draggingrotate = false;

        that.setTransition(false);

        e.stopPropagation();

        var body = document.querySelector('body');
        if (e.type == 'mousedown') {
            that.on(body, 'mousemove.transformable', _domove);
            that.on(body, 'mouseup.transformable dragend.transformable', _dostop);
        }
    },

    this.on(hdl, 'mousedown.transformable touchstart.transformable', _dostart)
    this.on(hdl, 'touchmove.transformable', _domove);
    this.on(hdl, 'touchend.transformable', _dostop);
}
Transformable.prototype._addResizeEvents = function (tlb, brb) {
    var that = this, el = this.element, opts = that.options;
    var
    _domove = function (e) {
        // not really implemented yet
        //if (that.options.disabled === true)
        //    return;

        if (!that.element.classList.contains('transformable-active')) 
            return false;
        

        if (!that.startedresize) return false;
        that.draggingresize = true;
        e.preventDefault();
        e.stopPropagation();
        var touches = e.touches, doupdate = false;

        if(touches)
            if (touches.length == 2)
                return false

        var point = that._getPoint2(e, touches),
            orig = that.origresize,
            start = that.startresize,
            cs = getComputedStyle(el);

        var delta = {
            trans: point.offset.sub(start.offset),
            angle: Math.round((point.angle - start.angle) * 100) / 100,
            distance: start.distance != 0 ? Math.round(point.distance / ((start.distance + point.distance)/2) * 1000) / 1000 : 0
        }

        if (delta.trans.nonzero()) {
            var 
                h = parseFloat(cs.height),
                w = parseFloat(cs.width);


            var dw = that.w - w,
                dh = that.h - h,
                neww = (w + delta.trans.x + dw),
                newh = (h + delta.trans.y + dh);

            el.style.width = neww + 'px';
            el.style.height = newh + 'px';

            that.sizes.element.initial.bottomright = new Point(neww, newh);
            that.sizes.element.initial.topright.x = neww;
            that.sizes.element.initial.bottomleft.y = newh;
            that.sizes.element.initial.width = neww;
            that.sizes.element.initial.height = newh;
            
        }                
        that.startresize.angle = point.angle;

        return false; // kill off bubble
    },
    _dostart = function (e) {
        if (document.querySelectorAll('.transformable-active').length == 0)
            that.element.classList.add('transformable-active');

        console.log('_resize.start');
        e.preventDefault();
        e.stopPropagation();

        var m = that.matrix;

        that.origresize = {
            trans: new Point(m.elements[4], m.elements[5]),
            angle: m.rotation(),
            scale: m.scaling()//,
        };
        var touches = e.touches;

        that.startresize = that._getPoint2(e, touches);
        that.startresize.scale = that.origresize.scale;
        that.startedresize = true;

        that.draggingresize = false;

        var cs = getComputedStyle(el);

        that.h = parseFloat(cs.height), 
        that.w = parseFloat(cs.width);


        if (typeof (that.contained) == 'undefined')
            that.contained = true;

        if(that.events.startresize)
            that.trigger('startresize', e);

        that.setTransition(false);

        if (e.type == 'mousedown') {
            var bodee = document.querySelector('body');
            that.on(bodee, 'mousemove.transformable', _domove);
            that.on(bodee, 'mouseup.transformable dragend.transformable', _dostop);
        }
        return false; // kill off bubble
    },
    _dostop = function () {
        var bodee = document.querySelector('body');
        that.off(bodee, 'mousemove.transformable', _domove);
        that.off(bodee, 'mouseup.transformable dragend.transformable', _dostop);

        if (that.options.disabled === true)
            return false;

        that.element.classList.remove('transformable-active');

        that.startedresize = false;
        that.draggingresize = false;
    }

    that.on(brb, 'mousedown.transformable', _dostart);
    that.on(brb, 'touchstart.transformable', _dostart);
    that.on(brb, 'touchmove.transformable', _domove);
    that.on(brb, 'touchend.transformable', _dostop);
}
Transformable.prototype.getRotationQuadrant = function (r) {
    var rot = (typeof r != 'undefined' ? r : this.matrix.rotation()) % 360;
    if(rot < 0) rot+=360;

    return { Angle: rot, Quad: Math.floor(rot / 90), Horiz: rot == 0 || rot == 180, Vert: rot == 90 || rot == 270 }
}
Transformable.prototype._addEvents = function () {
    var that = this,
        el = this.element,
        docontain = this.options && this.options.contain;

    if (typeof this.events.transition == 'function') {
        el.addEventListener('transitionend', this.events.transition);
    }

    var
    _domove = function (e) {
        if (that.options.disabled === true)
            return false;

        if (!that.element.classList.contains('transformable-active')) {
            return false;
        }
        if (!that.started || that.startedresize || that.startedrotate) {
            return false;
        }
        that.dragging = true;
        e.preventDefault();
        e.stopPropagation();

        var touches = e.touches, doupdate = false;
        if (touches && touches.length == 2)
            if (touches[0].target && touches[1].target)
                if (touches[0].target !== touches[1].target) {
                    console.log('Two active elements not supported');
                    return false;
                }

        var m = that.matrix;
        var cr = m.rotation();

        var disable = that.options.disable,
            disableZoom = false,
            disableTranslate = false,
            disableRotate = false;

        if (disable) {
            disableZoom = disable.zoom || disable.scale;
            disableRotate = disable.rotate;
            disableTranslate = disable.translate;
        }

        var point = that._getPoint2(e, touches),
            orig = that.orig,
            start = that.start;

        var delta = {
            trans: point.offset.sub(start.offset),
            angle: Math.round((point.angle - start.angle) * 100) / 100,
            distance: start.distance != 0 ? Math.round(point.distance / ((start.distance + point.distance) / 2) * 1000) / 1000 : 0
        }

        if (docontain && delta.angle == 0 && (!touches || (touches && touches.length == 1))) {
            var
                tl, tr, br, bl;

            var
                anc = that.Ancestry,
                parentT = anc.FirstParent(),
                prect = parentT.rect,
                inv = m.inverse(),
                ptl = prect.topleft,
                ptr = prect.topright,
                pbr = prect.bottomright,
                pbl = prect.bottomleft;

            tl = inv.transformpoint(ptl).sub(delta.trans);
            tr = inv.transformpoint(ptr).sub(delta.trans);
            br = inv.transformpoint(pbr).sub(delta.trans);
            bl = inv.transformpoint(pbl).sub(delta.trans);

            if (!start.size)
                start.size = new Point(that._distanceBetweenPoints(tl, tr), that._distanceBetweenPoints(tl, bl));
            else
                start.size = delta.distance != 0 ?
                    new Point(that._distanceBetweenPoints(tl, tr), that._distanceBetweenPoints(tl, bl))
                    :
                    start.size;

            var csiz = that.sizes.element.initial;
                
            var containment, opts = that.options;

            if (docontain == 'enclose') {
                var enclosed = {
                    tl: that.pointInRectangle(csiz.topleft, tl, tr, br, bl),
                    tr: that.pointInRectangle(csiz.topright, tl, tr, br, bl),
                    br: that.pointInRectangle(csiz.bottomright, tl, tr, br, bl),
                    bl: that.pointInRectangle(csiz.bottomleft, tl, tr, br, bl)
                };

                var containcount = 0;
                if(enclosed.tl.ok)
                    containcount++;
                if(enclosed.tr.ok)
                    containcount++;
                if(enclosed.br.ok)
                    containcount++;
                if(enclosed.bl.ok)
                    containcount++;

                var contained = containcount == 4;

                if (!contained) {
                    var quad = that.getRotationQuadrant(start.angle);
                    switch (quad.Quad) {
                        case 0:
                            if (quad.Angle == 0) {
                                if (!enclosed.br.ok) {
                                    var brv = csiz.bottomright.perpOnLine(tr, br).sub(csiz.bottomright), brh = csiz.bottomright.perpOnLine(bl, br).sub(csiz.bottomright);
                                    if (brv.x < 0) delta.trans = delta.trans.add(brv);
                                    if (brh.y < 0) delta.trans = delta.trans.add(brh);
                                }
                                if (!enclosed.tl.ok) {
                                    var tlv = csiz.topleft.perpOnLine(tl, bl), tlh = csiz.topleft.perpOnLine(tl, tr);
                                    if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                                    if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                                }
                            } else {
                                if (!enclosed.bl.ok) {
                                    var blv = csiz.bottomleft.perpOnLine(tl, bl).sub(csiz.bottomleft); //,

                                    if (blv.x > 0) delta.trans = delta.trans.add(blv);
                                }
                                if (!enclosed.br.ok) {
                                    var
                                        brh = csiz.bottomright.perpOnLine(bl, br).sub(csiz.bottomright);
                                    if (brh.y < 0) delta.trans = delta.trans.add(brh);
                                }
                                if (!enclosed.tr.ok) {
                                    var trv = csiz.topright.perpOnLine(tr, br).sub(csiz.topright); //,
                                    if (trv.x < 0) delta.trans = delta.trans.add(trv);
                                }
                                if (!enclosed.tl.ok) {
                                    var tlh = csiz.topleft.perpOnLine(tl, tr);
                                    if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                                }
                            }
                            break;
                        case 3:
                            if (quad.Angle == 270) {
                                if (!enclosed.tl.ok) {
                                    var tlh = csiz.topleft.perpOnLine(tl, bl),
                                        tlv = csiz.topleft.perpOnLine(bl, br);
                                    if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                                    if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                                }
                                if (!enclosed.br.ok) {
                                    var
                                        brv = csiz.bottomright.perpOnLine(tl, tr).sub(csiz.bottomright),
                                        brh = csiz.bottomright.perpOnLine(br, tr).sub(csiz.bottomright);
                                    if (brv.x < 0) delta.trans = delta.trans.add(brv);
                                    if (brh.y < 0) delta.trans = delta.trans.add(brh);
                                }
                            } else {
                                if (!enclosed.tl.ok) {
                                    var tlv = csiz.topleft.perpOnLine(tl, bl);
                                    if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                                }
                                if (!enclosed.br.ok) {
                                    var brv = csiz.bottomright.perpOnLine(tr, br).sub(csiz.bottomright);
                                    if (brv.x < 0) delta.trans = delta.trans.add(brv);
                                }
                                if (!enclosed.tr.ok) {
                                    var trh = csiz.topright.perpOnLine(tl, tr).sub(csiz.topright);
                                    if (trh.y > 0) delta.trans = delta.trans.add(trh);
                                }
                                if (!enclosed.bl.ok) {
                                    var blh = csiz.bottomleft.perpOnLine(bl, br).sub(csiz.bottomleft);
                                    if (blh.y < 0) delta.trans = delta.trans.add(blh);
                                }
                            }
                            break;
                        case 1:
                            if (quad.Angle == 90) { // can get away with 2 perp calcs instead of 4;
                                if (!enclosed.tl.ok) {
                                    var tlv = csiz.topleft.perpOnLine(tr, tl),
                                        tlh = csiz.topleft.perpOnLine(tr, br);

                                    if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                                    if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                                }
                                if (!enclosed.br.ok) {
                                    var brv = csiz.bottomright.perpOnLine(br, bl).sub(csiz.bottomright),
                                        brh = csiz.bottomright.perpOnLine(tl, bl).sub(csiz.bottomright);

                                    if (brv.x < 0) delta.trans = delta.trans.add(brv);
                                    if (brh.y < 0) delta.trans = delta.trans.add(brh);
                                }
                            } else {
                                if (!enclosed.tl.ok) {
                                    var tlv = csiz.topleft.perpOnLine(tr, br);
                                    if (tlv.x > 0) delta.trans = delta.trans.add(tlv);
                                }
                                if (!enclosed.br.ok) {
                                    var brv = csiz.bottomright.perpOnLine(tl, bl).sub(csiz.bottomright);
                                    if (brv.x < 0) delta.trans = delta.trans.add(brv);
                                }
                                if (!enclosed.tr.ok) {
                                    var trh = csiz.topright.perpOnLine(bl, br).sub(csiz.topright);
                                    if (trh.y > 0) delta.trans = delta.trans.add(trh);
                                }
                                if (!enclosed.bl.ok) {
                                    var blh = csiz.bottomleft.perpOnLine(tr, tl).sub(csiz.bottomleft);
                                    if (blh.y < 0) delta.trans = delta.trans.add(blh);
                                }
                            }
                            break;
                        case 2:
                            if (quad.Angle == 180) { // can get away with 2 calcs instead of 4;
                                if (!enclosed.tl.ok) {
                                    var tlv = csiz.topleft.perpOnLine(br, bl),
                                        tlh = csiz.topleft.perpOnLine(tl, bl);
                                    if (tlv.y > 0) delta.trans = delta.trans.add(tlv);
                                    if (tlh.y > 0) delta.trans = delta.trans.add(tlh);
                                }
                                if (!enclosed.br.ok) {
                                    var
                                        brv = csiz.bottomright.perpOnLine(tr, tl).sub(csiz.bottomright),
                                        brh = csiz.bottomright.perpOnLine(tr, br).sub(csiz.bottomright);
                                    if (brv.y < 0) delta.trans = delta.trans.add(brv);
                                    if (brh.y < 0) delta.trans = delta.trans.add(brh);
                                }
                            }
                            if (!enclosed.tl.ok) {
                                var tlv = csiz.topleft.perpOnLine(br, bl);
                                if (tlv.y > 0) delta.trans = delta.trans.add(tlv);
                            }
                            if (!enclosed.br.ok) {
                                var brv = csiz.bottomright.perpOnLine(tr, tl).sub(csiz.bottomright);//,
                                if (brv.y < 0) delta.trans = delta.trans.add(brv);
                            }

                            if (!enclosed.tr.ok) {
                                var trh = csiz.topright.perpOnLine(tl, bl).sub(csiz.topright);
                                if (trh.x < 0) delta.trans = delta.trans.add(trh);
                            }
                            if (!enclosed.bl.ok) {
                                var blh = csiz.bottomleft.perpOnLine(tr, br).sub(csiz.bottomleft);
                                if (blh.x > 0) delta.trans = delta.trans.add(blh);
                            }
                            break;
                    }
                }
            }
            if (docontain == 'cover') {
                var enclosed = {
                    tl: that.pointInRectangle(csiz.topleft, tl, tr, br, bl),
                    tr: that.pointInRectangle(csiz.topright, tl, tr, br, bl),
                    br: that.pointInRectangle(csiz.bottomright, tl, tr, br, bl),
                    bl: that.pointInRectangle(csiz.bottomleft, tl, tr, br, bl)
                };

                var okcorners = 0;
                if (!enclosed.tl.ok) okcorners++;
                if (!enclosed.tr.ok) okcorners++;
                if (!enclosed.br.ok) okcorners++;
                if (!enclosed.bl.ok) okcorners++;

                if ((!enclosed.tl.ok &&
                    !enclosed.tr.ok &&
                    !enclosed.br.ok &&
                    !enclosed.bl.ok
                    )||that.lockcontain||(okcorners == 3 && start.angle == 0)) {
                    that.lockcontain = true;
                    var quad = that.getRotationQuadrant(start.angle);
                    switch (quad.Quad) {
                        case 0:
                            if (tr.y <= 0)
                                delta.trans.y = delta.trans.y + tr.y;
                            if (bl.y >= csiz.bottomleft.y)
                                delta.trans.y = delta.trans.y + (bl.y - csiz.bottomleft.y);
                            if (br.x >= csiz.bottomright.x)
                                delta.trans.x = delta.trans.x + (br.x - csiz.bottomright.x);
                            if (tl.x <= 0)
                                delta.trans.x = delta.trans.x + tl.x;
                            break;
                        case 1:
                            if (tl.y >= csiz.bottomleft.y)
                                delta.trans.y = delta.trans.y + (tl.y - csiz.bottomleft.y);
                            if (bl.x >= csiz.topright.x)
                                delta.trans.x = delta.trans.x - (csiz.topright.x - bl.x);
                            if (br.y <= 0) // works
                                delta.trans.y = delta.trans.y + br.y;
                            if (tr.x <= 0)
                                delta.trans.x = delta.trans.x + tr.x;
                            break;
                        case 2:
                            if (bl.y <= 0) // works
                                delta.trans.y = delta.trans.y + bl.y;
                            if (tl.x >= csiz.bottomright.x)
                                delta.trans.x = delta.trans.x - (csiz.bottomright.x - tl.x);
                            if (tr.y >= csiz.bottomleft.y)
                                delta.trans.y = delta.trans.y + (tr.y - csiz.bottomleft.y);
                            if (br.x <= 0)
                                delta.trans.x = delta.trans.x + br.x;
                            //console.log('points')
                            //console.log(tl)
                            //console.log(tr)
                            //console.log(br)
                            //console.log(bl)
                            break;
                        case 3:
                            if (tl.y <= 0) // works
                                delta.trans.y = delta.trans.y + tl.y;
                            if (bl.x <= 0)
                                delta.trans.x = delta.trans.x + bl.x;
                            if (br.y >= csiz.bottomright.y) // works
                                delta.trans.y = delta.trans.y + (br.y - csiz.bottomright.y);
                            if (tr.x >= csiz.topright.x)
                                delta.trans.x = delta.trans.x - (csiz.topright.x - tr.x);

                            break;
                    }
                }
            }
        }

        if (delta.trans.nonzero() && !disableTranslate) {
            m.translate(delta.trans);
            doupdate = true;
            that.delta.x += delta.trans.x;
            that.delta.y += delta.trans.y;
        }

        if (delta.distance != 0 && delta.distance != 1 && touches)
            if (touches.length == 2 && !disableZoom) {
                m.scale(point.offset, delta.distance);

                doupdate = true;

            }

        if (delta.angle != 0 && !disableRotate) {
            m.rotateAboutPoint(point.offset, delta.angle);
            doupdate = true;
        }

        if (doupdate)
            that._updateElement(m);

        that.start.angle = point.angle;

        if (that.events.move)
            that.trigger('move', e);

        return false;
    },
    _dostart = function (e) {
        if (that.options.disabled === true)
            return false;
        if (that.startedresize || that.startedrotate)
            return false;

        if (document.querySelectorAll('.transformable-active').length == 0)
            that.element.classList.add('transformable-active');

        if (that.options.type == 'rotator-box') {
            var rb = e.target.closest('svg')

            if (rb && !rb.classList.contains('transformable-svg-anchor')) {
                return false;
            } else
                e.stopPropagation();
        }

        var touches = e.touches;
        that.start = that._getPoint2(e, touches);

        var ww = that.sizes.window;
        if (that.start.pageX < 40 || that.start.pageX > ww.width - 40) // don't translate if history navigation can happen from swipe
        { console.log('edge cancel'); return false; }

        that.delta = { x: 0, y: 0 };

        if (touches && touches.length == 2)
            if (touches[0].target && touches[1].target)
                if (touches[0].target !== touches[1].target) {
                    console.log('Two active elements not supported');
                    return false;
                }

        var m = that.matrix;

        that.orig = {
            trans: new Point(m.elements[4], m.elements[5]),
            angle: m.rotation(),
            scale: m.scaling(),
        };

        that.start.scale = that.orig.scale;
        that.started = true;
        that.dragging = false;

        if (that.events.start)
            that.trigger('start', e);

        that.setTransition(false);

        if (e.type == 'mousedown') {
            var bodee = document.querySelector('body');
            that.on(bodee, 'mousemove.transformable', _domove);
            that.on(bodee, 'mouseup.transformable dragend.transformable', _dostop);
        }
    },
    _dostop = function (e) {
        var bodee = document.querySelector('body');
        that.off(bodee, 'mousemove.transformable', _domove);
        that.off(bodee, 'mouseup.transformable dragend.transformable', _dostop);

        that.element.classList.remove('transformable-active');
        that.element.classList.remove('transformable-reset');

        if (that.options.disabled === true)
            return false;

        that.lockcontain = false;

        if (that.started === true && that.dragging === true) {
            that._pushhistory();
            that.snapRotation();
        }

        if (that.started === true && that.dragging === false)
            if (that.events.tap)
                that.trigger('tap', e);

        that.dragging = false;
        that.started = false;
        if (that.events.stop)
            that.trigger('stop', e);

        that.setTransition(true);

        var
            rb = that.rotatorBox,
            tlb = that.resizertl,
            brb = that.resizerbr;

        if (rb) {
            var nsc = that.matrix.scaling();
            rb.scale(new Point(0), (1 / rb.matrix.scaling()) * (1 / nsc));
        }
        if (tlb && brb) {
            var nscc = nsc || that.matrix.scaling(); //,

            tlb.style.transform = 'scale(' + (1 / nscc) + ')';
            brb.style.transform = 'scale(' + (1 / nscc) + ')';
        }
    },
    _dowheelzoom = function (e) {
        if (that.options.disabled === true)
            return false;
        if (that.startedresize || that.startedrotate)
            return false;
        if (that.options.type == 'rotator-box')
            return false;

        e.preventDefault();
        e.stopPropagation();

        var now = Date.now(),
            dmw = that.lastwheelmove ? now - that.lastwheelmove : 150;

        if (dmw < 150 && navigator.userAgent.indexOf('Mac') > -1)
            return false;

        if (document.querySelectorAll('.transformable-active').length == 0)
            that.element.classList.add('transformable-active');

        if (that.rotatorBox)
            that.rotatorBox.parent.classList.add('transformable-wheel-active');

        if (that._wheelTimer) 
            clearTimeout(that._wheelTimer);

        var point = that._getPoint2(e),
            m = that.matrix,
            s = m.scaling(),
            ds,
            sy = 0.05, 
            acc = point.deltaXY.y < 0 ? 1 : -1;

        that.setTransition(true);


        if (point.deltaXY.y != 0) {
            ds = 1 + (sy * acc);
            m.scale(point.offset, ds);
            that._updateElement();
            //console.log(ds);
        };
        that.element.classList.remove('transformable-active');

        that._wheelTimer = setTimeout(function () {
            that._pushhistory();
            if (that.rotatorBox)
                that.rotatorBox.parent.classList.remove('transformable-wheel-active');


        }, 750);
        that.lastwheelmove = now;
    };

    that.on(el, 'mousedown.transformable', _dostart);
    that.on(el, 'touchstart.transformable', _dostart);
    that.on(el, 'touchmove.transformable', _domove);
    that.on(el, 'touchend.transformable', _dostop);

    that.on(el, 'scroll.transformable', function (e) {
        console.log('tried scroll');
        e.preventDefault(); e.stopPropagation(); return false;
    });

    if (!this.options.disable || (this.options.disable && !this.options.disable.wheel))
        if(navigator.userAgent.indexOf('Mac OS') == -1) // some issues with wild zoom on magic mouse, so turn it off
            addWheelListener(el, _dowheelzoom);
}
Transformable.Handlers = { Namespaces: {} };

Transformable.prototype.on = function (el, event, func, opts) {
    var events = event.split(' '), i, sp, ev, ns, pl;
    for (i = 0; i < events.length; i++) {
        sp = events[i].split('.'), ev = sp[0], ns = sp.length > 1 ? sp[1] : false;
        el.addEventListener(ev, func, opts || false);

        if (!Transformable.Handlers.Namespaces[event])
            Transformable.Handlers.Namespaces[event] = [];

        if (ns)
            if (!Transformable.Handlers.Namespaces[ns])
                Transformable.Handlers.Namespaces[ns] = [];

        pl = Transformable.Handlers.Namespaces[event].push({ event: ev, func: func, opts: opts || false });
        if (ns)
            Transformable.Handlers.Namespaces[ns].push(Transformable.Handlers.Namespaces[event][pl - 1]);
    }
};
Transformable.prototype.off = function (el, event, opts) {
    var x = Transformable.Handlers.Namespaces[event], tv;
    if (x)
        for (var i = 0; i < x.length; i++) {
            tv = x[i];
            el.removeEventListener(tv.event, tv.func, tv.opts);
        }

};
Transformable.prototype.Refresh = function () {
    this.sizes = undefined;
    this.setInitialSizes();
    this.Ancestry.Refresh();
}; // <--- dont forget this semicolon, it will break the next closure if missing
(function() {        
    var timer, rtimer
    window.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(refreshtransformables, 150);
    });
    //window.addEventListener('scroll', function () {
    //    clearTimeout(rtimer);
    //    rtimer = setTimeout(refreshtransformables, 150);
    //});

    var refreshtransformables = function () { 
        // do stuff
        var ts = document.querySelectorAll('.transformable').forEach(function (v, i) {
            var i = v.getAttribute('data-transformable-id'),
                t = i ? Transformable.Instance[i] : false;

            if (t instanceof Transformable) 
                t.Refresh()
        });
    };
})(); // end