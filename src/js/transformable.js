import '../css/transformable.css';
import Matrix from './Matrix.js';
import Ancestry from './Ancestry.js';
import Point from './Point.js';

// Wheel event polyfill (modernized slightly for scope, but logic preserved for compatibility)
((window, document) => {
    let prefix = "";
    let _addEventListener;

    // Detect event model
    if (window.addEventListener) {
        _addEventListener = "addEventListener";
    } else {
        _addEventListener = "attachEvent";
        prefix = "on";
    }

    // Detect available wheel event
    const support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers
                    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE
                    "DOMMouseScroll"; // Older Firefox

    window.addWheelListener = (elem, callback, useCapture) => {
        const _addWheelListener = (targetElem, eventName, cb, capture) => {
            targetElem[_addEventListener](prefix + eventName, support === "wheel" ? cb : (originalEvent) => {
                const event = originalEvent || window.event;

                // Create a normalized event object
                const normalizedEvent = {
                    originalEvent: event,
                    target: event.target || event.srcElement,
                    type: "wheel",
                    deltaMode: event.type === "MozMousePixelScroll" ? 0 : 1,
                    deltaX: 0,
                    deltaY: 0,
                    deltaZ: 0,
                    preventDefault() {
                        event.preventDefault ?
                            event.preventDefault() :
                            event.returnValue = false;
                    },
                    stopPropagation() {
                        event.stopPropagation ?
                            event.stopPropagation() :
                            event.returnValue = false;
                    },
                };

                // Calculate deltaY (and deltaX)
                if (support === "mousewheel") {
                    normalizedEvent.deltaY = -1 / 40 * event.wheelDelta;
                    if (event.wheelDeltaX) {
                        normalizedEvent.deltaX = -1 / 40 * event.wheelDeltaX;
                    }
                } else {
                    normalizedEvent.deltaY = event.detail;
                }

                return cb(normalizedEvent);
            }, capture || false);
        };

        _addWheelListener(elem, support, callback, useCapture);

        // Handle MozMousePixelScroll in older Firefox
        if (support === "DOMMouseScroll") {
            _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture);
        }
    };
})(window, document);

class Transformable {
    /**
     * A store/lookup of all transformable instances.
     * Each transformable element is given a data attribute for its id in this lookup.
     */
    static Instance = [];
    /**
     * Datastore for any namespaced events attached to elements by .on(....)
     */
    static Handlers = { Namespaces: {} };

    /**
     * Constructor
     * @param {HTMLElement} el
     * @param {Object} opts
     */
    constructor(el, opts = {}) {
        this.element = el.length ? el[0] : el;
        this.options = opts;
        
        this.element.classList.add('transformable');
        this.parent = this.element.parentNode;

        this.setInitialSizes();

        if (opts.matrix) {
            const cscale = { x: 1, y: 1 };
            if (opts.computedsize?.width || opts.computedsize?.Width) {
                const precs = {
                    width: opts.computedsize.width || opts.computedsize.Width,
                    height: opts.computedsize.height || opts.computedsize.Height
                };
                const curcs = this.sizes.element.initial;
                cscale.x = curcs.width / precs.width;
                cscale.y = curcs.height / precs.height;
            }
            if (Array.isArray(opts.matrix) && opts.matrix.length === 6) {
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

        this.dragging = false;
        this.start = null;
        this.orig = null;
        this.zooma = 0.001;

        this.events = {
            start: opts.start,
            move: opts.move,
            stop: opts.stop,
            tap: opts.tap,
            transition: opts.transition
        };

        this.element.setAttribute('data-transformable-id', Transformable.Instance.push(this) - 1);
        if (!navigator.userAgent.includes('Edge')) {
            this.element.setAttribute('draggable', 'false');
        }

        if ((opts.attachevents ?? true) && opts.editable !== false) {
            this._addEvents();
            if (opts.resize) this.createResizeHandles(opts.resize);
            if (!opts.disable?.rotate) this.createRotateHandles();
            if (opts.handle && opts.type === 'rotator-box') this._addRotateEvents(opts.handle);
        }
    }

    /**
     * Gets any existing CSS transition that exists on the element.
     * It will be merged with transition changes to preserve existing effects
     */
    _getOriginalTransition() {
        const t = getComputedStyle(this.element).transition;
        if (!t) return '';
        return t.split(',').filter(part => !part.trim().startsWith('transform')).join(',');
    }

    /**
     * Creates an HTML Element from a string.
     * @param {String} str E.g. span, div etc
     */
    tag(str) {
        const r = document.createElement('div');
        r.innerHTML = str;
        return r.firstChild;
    }

    /**
     * Adds rotation handles on to the transformable element and wires up their events
     * @param {String} typ 
     */
    createRotateHandles(typ) {
        if (typ && typ !== 'rotate') return;

        const box = this.tag('<div class="transformable-rotation-box"></div>');
        const rot = this.tag('<svg class="transformable-svg-rotator" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve"><g><circle style="fill:#00A8DF;" cx="48.3" cy="48" r="35.3"/><g><path style="fill:#FFFFFF;" d="M35.2,3.8l4.1,28.5c0.2,1.5,2,2.1,3,1l8.2-8.2c0.7-0.7,1.8-0.7,2.5,0l8.8,8.8c7.8,7.8,9.1,20.2,1.2,28.2l-10,10c-0.7,0.7-1.8,0.7-2.5,0L41,62.6c-1-1-2.8-0.4-3,1l-4.1,28.5c-0.2,1.2,0.8,2.2,2,2l28.5-4.1c1.5-0.2,2.1-2,1-3l-8.9-8.9c-0.7-0.7-0.7-1.8,0-2.5l10-10c9.8-9.8,8.5-25.6-1.2-35.2l-8.8-8.8c-0.7-0.7-0.7-1.8,0-2.5L66.7,8.9c1-1,0.4-2.8-1-3L37.2,1.8C36,1.6,35,2.6,35.2,3.8z"/><g style="opacity:0.5;"><path d="M36.9,1.8c0.1,0,0.2,0,0.3,0l28.5,4.1c1.5,0.2,2.1,2,1,3L56.6,19.1c-0.7,0.7-0.7,1.8,0,2.5l8.8,8.8c9.7,9.7,11,25.5,1.2,35.2l-10,10c-0.7,0.7-0.7,1.8,0,2.5l8.9,8.9c1,1,0.4,2.8-1,3l-28.5,4.1c-0.1,0-0.2,0-0.3,0c-1.1,0-1.9-1-1.8-2.1l4.1-28.5c0.1-1,0.9-1.5,1.8-1.5c0.4,0,0.9,0.2,1.3,0.5l9.5,9.5c0.4,0.4,0.8,0.5,1.3,0.5s0.9-0.2,1.3-0.5l10-10c8-8,6.7-20.3-1.2-28.2L53,25.2c-0.4-0.4-0.8-0.5-1.3-0.5s-0.9,0.2-1.3,0.5l-8.2,8.2c-0.4,0.4-0.8,0.5-1.3,0.5c-0.8,0-1.7-0.6-1.8-1.5L35.2,3.8C35,2.7,35.9,1.8,36.9,1.8 M36.9-0.2c-1.1,0-2.1,0.5-2.9,1.3c-0.7,0.8-1,1.9-0.9,3l4.1,28.5c0.3,1.9,1.9,3.3,3.8,3.3c1,0,2-0.4,2.7-1.1l8.1-8.1l8.7,8.7c7.4,7.4,8,18.6,1.2,25.3l-9.8,9.8l-9.3-9.3c-0.7-0.7-1.7-1.1-2.7-1.1c-1.9,0-3.5,1.4-3.8,3.3l-4.1,28.5c-0.2,1.1,0.2,2.2,0.9,3c0.7,0.8,1.8,1.3,2.9,1.3c0.2,0,0.4,0,0.5,0l28.5-4.1c1.4-0.2,2.6-1.2,3.1-2.6c0.5-1.4,0.1-2.9-0.9-3.9l-8.7-8.7l9.8-9.8c10.2-10.2,9.6-27.2-1.2-38.1l-8.7-8.7l10-10c1-1,1.4-2.5,0.9-3.9c-0.5-1.4-1.6-2.4-3.1-2.6L37.5-0.2C37.3-0.2,37.1-0.2,36.9-0.2L36.9-0.2z"/></g></g></g></svg>');
        const anc = this.tag('<svg class="transformable-svg-anchor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 96 96" style="enable-background:new 0 0 96 96;" xml:space="preserve"><g><circle style="fill:#00A8DF;" cx="47.6" cy="48.4" r="17.6"/><g><path style="fill:#FFFFFF;" d="M69,46H50V27.2c0-1.4-1.1-2.4-2.5-2.4S45,25.9,45,27.2V46H26.6c-1.4,0-2.4,1.1-2.4,2.5s1.1,2.5,2.4,2.5H45v18.6c0,1.4,1.1,2.4,2.5,2.4s2.5-1.1,2.5-2.4V51h19c1.4,0,2.4-1.1,2.4-2.5S70.3,46,69,46z"/><g style="opacity:0.5;"><path d="M47.5,24.8c1.4,0,2.5,1.1,2.5,2.4V46h19c1.4,0,2.4,1.1,2.4,2.5c0,1.4-1.1,2.5-2.4,2.5H50v18.6c0,1.4-1.1,2.4-2.5,2.4S45,70.9,45,69.6V51H26.6c-1.4,0-2.4-1.1-2.4-2.5c0-1.4,1.1-2.5,2.4-2.5H45V27.2C45,25.9,46.1,24.8,47.5,24.8 M47.5,22.8c-2.5,0-4.5,2-4.5,4.4V44H26.6c-2.5,0-4.4,2-4.4,4.5c0,2.5,2,4.5,4.4,4.5H43v16.6c0,2.5,2,4.4,4.5,4.4s4.5-2,4.5-4.4V53h17c2.5,0,4.4-2,4.4-4.5c0-2.5-2-4.5-4.4-4.5H52V27.2C52,24.8,50,22.8,47.5,22.8L47.5,22.8z"/></g></g></g></svg>');
        const lin = this.tag('<div class="transformable-rotation-line"></div>');

        box.append(lin, anc, rot, this.tag('<div class="transformable-anchor-point"></div>'));

        if (this.element.nodeName === 'IMG') {
            this.parent.appendChild(box);
        } else {
            this.element.appendChild(box);
        }

        box.addEventListener('click', e => { e.stopPropagation(); return false; });

        this.rotatorBox = new Transformable(box, { type: 'rotator-box', rotatetarget: this, handle: rot, disable: { zoom: true, rotate: true, resize: true } });

        const _domouseup = () => {
            if (this.rotatorBox?.parent) {
                this.rotatorBox.parent.classList.remove('transformable-mousedown');
            }
            this.off(document.body, 'mouseup.rotatormouse');
        };
        const _domousedown = () => {
            this.rotatorBox.parent.classList.add('transformable-mousedown');
            this.on(document.body, 'mouseup.rotatormouse', _domouseup);
        };
        const _domouseleave = (e) => {
            if (this._overTimer) clearTimeout(this._overTimer);

            this._resizeTimer = setTimeout(() => {
                this.element.classList.remove('transformable-resize-over');
            }, 500);

            e.currentTarget.classList.remove('transformable-over-active', 'transformable-over');
        };
        const _domouseenter = (tim) => {
            if (tim.stopPropagation) tim.stopPropagation();
            if (this._resizeTimer) clearTimeout(this._resizeTimer);

            const target = this.rotatorBox.parent;
            target.classList.add('transformable-over', 'transformable-resize-over');

            this.Ancestry.Items.forEach(v => {
                if (v._overTimer) clearTimeout(v._overTimer);
            });

            this._overTimer = setTimeout(() => {
                const rb = this.rotatorBox;
                if (parseFloat(getComputedStyle(rb.element).width) >= 32) {
                    rb.parent.classList.add('transformable-over-active');
                }
                const l = this.Ancestry.Items.length;
                this.Ancestry.Items.forEach((v, i) => {
                    if (i < l - 2) {
                        v.element.classList.remove('transformable-over-active');
                    }
                });
            }, typeof tim === 'number' ? tim : 1500);
        };

        const rotparent = this.rotatorBox.parent;
        this.on(rotparent, 'mouseenter.rotatormouse', _domouseenter);
        this.on(rotparent, 'mouseleave.rotatormouse', _domouseleave);
        this.on(rotparent, 'mousedown.rotatormouse', _domousedown);
        this.on(rotparent, 'click.rotatormouse', () => _domouseenter.call(rotparent, 0));
    }
    
    /**
     * Creates resize handles on the transformable element and wires up their events
     * @param {String} typ
     */
    createResizeHandles(typ) {
        if (typ !== 'tl-br') return;
        
        const tl_svg = this.tag('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-271 394.9 52 52" style="enable-background:new -271 394.9 52 52;" xml:space="preserve"><g><path style="fill:#00A8DF;" d="M-244.9,421L-244.9,421L-244.9,421L-244.9,421L-244.9,421l26,0.1c0-10.8-6.1-20-16-24.1 c-10-4.1-20.8-2-28.4,5.7c-7.6,7.6-9.7,18.5-5.6,28.4c4.2,10,13.4,16,24.2,15.9L-244.9,421z"/><path style="fill:none;stroke:#FFFFFF;stroke-width:3;" d="M-251.6,414.3"/><path style="fill:none;stroke:#FFFFFF;stroke-width:3;" d="M-236.6,414.3"/></g><g><path style="fill:#FFFFFF;" d="M-227,419.5l-7.6-4.4c-1.1-0.6-2.4,0.2-2.4,1.4v1.9h-5.6v-5.5h2c1.2,0,2-1.3,1.4-2.4l-4.4-7.6 c-0.6-1.1-2.1-1.1-2.7,0l-4.4,7.6c-0.6,1.1,0.2,2.4,1.4,2.4h2v5.5h-5.6v-1.9c0-1.2-1.3-2-2.4-1.4l-7.6,4.4c-1.1,0.6-1.1,2.1,0,2.7 l7.6,4.4c1.1,0.6,2.4-0.2,2.4-1.4v-2h5.6v5.6h-2c-1.2,0-2,1.3-1.4,2.4l4.4,7.6c0.6,1.1,2.1,1.1,2.7,0l4.4-7.6 c0.6-1.1-0.2-2.4-1.4-2.4h-2v-5.6h5.6v2c0,1.2,1.3,2,2.4,1.4l7.6-4.4C-225.9,421.7-225.9,420.1-227,419.5z"/><path style="opacity:0.5;fill:#231F20;" d="M-245,402.1c0.5,0,1.1,0.3,1.4,0.8l4.4,7.6c0.6,1.1-0.2,2.4-1.4,2.4h-2v5.5h5.6v-1.9 c0-0.9,0.8-1.6,1.6-1.6c0.3,0,0.5,0.1,0.8,0.2l7.6,4.4c1.1,0.6,1.1,2.1,0,2.7l-7.6,4.4c-0.3,0.1-0.5,0.2-0.8,0.2 c-0.8,0-1.6-0.7-1.6-1.6v-2h-5.6v5.6h2c1.2,0,2,1.3,1.4,2.4l-4.4,7.6c-0.3,0.5-0.8,0.8-1.4,0.8c-0.5,0-1.1-0.3-1.4-0.8l-4.4-7.6 c-0.6-1.1,0.2-2.4,1.4-2.4h2v-5.6h-5.6v2c0,0.9-0.8,1.6-1.6,1.6c-0.3,0-0.5-0.1-0.8-0.2l-7.6-4.4c-1.1-0.6-1.1-2.1,0-2.7l7.6-4.4 c0.3-0.1,0.5-0.2,0.8-0.2c0.8,0,1.6,0.7,1.6,1.6v1.9h5.6v-5.5h-2c-1.2,0-2-1.3-1.4-2.4l4.4-7.6C-246.1,402.3-245.5,402.1-245,402.1 M-245,400.6c-1.1,0-2.1,0.6-2.6,1.5l-4.4,7.6c-0.5,0.9-0.5,2.1,0,3c0.5,0.9,1.5,1.5,2.6,1.5h0.5v2.7h-2.7v-0.5c0-1.7-1.4-3-3-3 c-0.5,0-1,0.1-1.5,0.4l-7.6,4.4c-0.9,0.5-1.5,1.5-1.5,2.6c0,1.1,0.6,2.1,1.5,2.6l7.6,4.4c0.5,0.3,1,0.4,1.5,0.4c1.7,0,3-1.4,3-3	v-0.6h2.7v2.8h-0.5c-1.1,0-2.1,0.6-2.6,1.5c-0.5,0.9-0.5,2.1,0,3l4.4,7.6c0.5,0.9,1.5,1.5,2.6,1.5c1.1,0,2.1-0.6,2.6-1.5l4.4-7.6 c0.5-0.9,0.5-2.1,0-3c-0.5-0.9-1.5-1.5-2.6-1.5h-0.5v-2.8h2.7v0.6c0,1.7,1.4,3,3,3c0.5,0,1-0.1,1.5-0.4l7.6-4.4	c0.9-0.5,1.5-1.5,1.5-2.6c0-1.1-0.6-2.1-1.5-2.6l-7.6-4.4c-0.5-0.3-1-0.4-1.5-0.4c-1.7,0-3,1.4-3,3v0.5h-2.7v-2.7h0.5	c1.1,0,2.1-0.6,2.6-1.5c0.5-0.9,0.5-2.1,0-3l-4.4-7.6C-242.9,401.2-243.9,400.6-245,400.6L-245,400.6z"/></g></svg>');
        const br_svg = this.tag('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-271 394.9 52 52" style="enable-background:new -271 394.9 52 52;" xml:space="preserve"><g><path style="fill:#00A8DF;" d="M-245,420.9L-245,420.9L-245,420.9L-245,420.9L-245,420.9l-26-0.1c0,10.8,6.1,20,16,24.1 c10,4.1,20.8,2,28.4-5.7c7.6-7.6,9.7-18.5,5.6-28.4c-4.2-10-13.4-16-24.2-15.9L-245,420.9z"/></g><g><path style="fill:#FFFFFF;" d="M-245.8,423l-2.5-2.5l-2.1,2.1c-0.9,0.9-2.3,0.5-2.6-0.7l-1.6-9.2c-0.3-1.2,0.8-2.3,1.9-1.9l9.2,1.6 c1.2,0.3,1.6,1.8,0.7,2.6l-2.1,2.1l2.5,2.5l2.7,2.7l-1-1l2.1-2.1c0.9-0.9,2.3-0.5,2.6,0.7l1.6,9.2c0.3,1.2-0.8,2.3-1.9,1.9 l-9.2-1.6c-1.2-0.3-1.6-1.8-0.7-2.6l2.1-2.1l-3.2-3.2L-245.8,423z"/><path style="opacity:0.5;fill:#231F20;" d="M-239.6,422.3l-1-1l2.1-2.1c0.7-0.7,1.7-0.6,2.2,0c0.2,0.2,0.3,0.4,0.4,0.7l1.6,9.2 c0.3,1.2-0.8,2.3-1.9,1.9l-9.2-1.6c-0.3-0.1-0.5-0.2-0.7-0.4c-0.6-0.6-0.7-1.6,0-2.2l2.1-2.1l-3.2-3.2l1.5,1.5l-2.5-2.5l-2.1,2.1 c-0.7,0.7-1.7,0.6-2.2,0c-0.2-0.2-0.3-0.4-0.4-0.7l-1.6-9.2c-0.3-1.2,0.8-2.3,1.9-1.9l9.2,1.6c0.3,0.1,0.5,0.2,0.7,0.4 c0.6,0.6,0.7,1.6,0,2.2l-2.1,2.1l2.5,2.5L-239.6,422.3z M-242.3,417.5l-0.5-0.5l1-1c1.2-1.2,1.2-3.1,0-4.3 c-0.4-0.4-0.8-0.6-1.4-0.8l-9.2-1.6c-1.1-0.3-2.1,0-2.9,0.8c-0.8,0.8-1.1,1.9-0.8,2.9l1.6,9.2c0.1,0.5,0.4,1,0.8,1.4 c1.2,1.2,3.1,1.2,4.3,0l1.1-1.1l0.5,0.5l0.5,0.5l1.2,1.2l-1.1,1.1c-1.2,1.2-1.2,3.1,0,4.3c0.4,0.4,0.8,0.6,1.4,0.8l9.2,1.6 c1.1,0.3,2.1,0,2.9-0.8c0.8-0.8,1.1-1.9,0.8-2.9l-1.6-9.2c-0.1-0.5-0.4-1-0.8-1.4c-1.2-1.2-3.1-1.2-4.3,0l-1,1l-1.2-1.2"/></g></svg>');

        const tlb = this.tag('<div class="transformable-resize-button"></div>');
        const brb = tlb.cloneNode();

        tlb.classList.add('tl');
        tlb.appendChild(tl_svg);
        brb.classList.add('br');
        brb.appendChild(br_svg);

        this.resizertl = tlb;
        this.resizerbr = brb;

        this.element.appendChild(tlb);
        this.element.appendChild(brb);
        this._addResizeEvents(tlb, brb);
    }
    
    /**
     * Zooms the element centred on the middle of the parent element in increments of 5%.
     * @param {Number} dir positive numbers make it bigger, negative make it smaller
     */
    zoom(dir) {
        const offset = this.Ancestry.OffsetFromPoint(this._findCentreInWindow());
        this.scale(offset, 1 + dir * 0.05);
        return this;
    }

    /**
     * Scales the transformable element at point p by s amount
     * @param {Point} p Origin for the transform on the element
     * @param {any} s scale amount
     */
    scale(p, s) {
        this.matrix.scale(p, s);
        this.setTransition(true);
        this._updateElement();
        return this;
    }

    /**
     * Translates the element by x and y. Uses element pixels before any transform. Not window/screen pixels.
     * @param {Number} x Pixels horizontal
     * @param {Number} y Pixels vertical
     * @param {Boolean} transition Use a transition
     */
    translate(x, y, transition) {
        this.matrix.translate(x, y);
        this.setTransition(transition);
        this._updateElement();
        return this;
    }

    /**
     * Rotates the element about point p. Or about the centre of the element if p is not supplied. 
     * If inwindow==true, you can supply a Point in the window coordinate space and have the element rotate about that.
     * @param {Point} p The origin of the rotation in pixels on the element. When inwindow == false or undefined
     * @param {Number} a Angle in degrees
     * @param {Boolean} trans Optional: Specify if a transition should be used
     * @param {Boolean} inwindow Optional: If true, p should be treated like a window coordinate. 
     */
    rotate(p, a, trans, inwindow) {
        let rotationPoint = p;
        if (!(rotationPoint instanceof Point) || !rotationPoint) {
            rotationPoint = this.Ancestry.OffsetFromPoint(this._findCentreInWindow());
        }

        if (rotationPoint instanceof Point && inwindow) {
            rotationPoint = this.Ancestry.OffsetFromPoint(rotationPoint);
        }

        this.matrix.rotate(rotationPoint, a);
        this.lastrotationpoint = rotationPoint;
        if (typeof trans === 'undefined' || trans === false) {
            this.setTransition(false);
        }

        this._updateElement();
        return this;
    }

    /**
     * Makes a rotated element horizontal.
     */
    straighten() {
        const r = this.matrix.rotation();
        this.rotate(new Point(this.sizes.element.initial.width / 2, this.sizes.element.initial.height / 2), -r, true);
        return this;
    }

    /**
     * Scales the element to make the element's height or width match that of the parent element. Centres it and straightens out any rotation. 
     */
    fittoparent() {
        const sz = new Point(this.sizes.element.initial.width, this.sizes.element.initial.height);
        const anc = this.Ancestry;
        const pars = anc.GetParents();
        const parentT = anc.FirstParent();
        const pr = parentT.rect;
        const m = this.matrix.inverse();
        const tl = m.transformpoint(pr.topleft);
        const tr = m.transformpoint(pr.topright);
        const bl = m.transformpoint(pr.bottomleft);
        const psiz = new Point(this._distanceBetweenPoints(tl, tr), this._distanceBetweenPoints(tl, bl));

        const sc = psiz.divide(sz);
        const scale = Math.min(sc.x, sc.y);
        this.scale(new Point(0, 0), scale);
        this.centreinparent(true, pars);
        this.straighten();

        return this;
    }

    /**
     * Scales the element so its width and height is equal or greater than the parent element. 
     * Basically so you can't see any background in the parent element. Also centres and straightens it.
     */
    filltoparent() {
        const sz = new Point(this.sizes.element.initial.width, this.sizes.element.initial.height);
        const anc = this.Ancestry;
        const pars = anc.GetParents();
        const parentT = anc.FirstParent();
        const pr = parentT.rect;
        const m = this.matrix.inverse();
        const tl = m.transformpoint(pr.topleft);
        const tr = m.transformpoint(pr.topright);
        const bl = m.transformpoint(pr.bottomleft);
        const psiz = new Point(this._distanceBetweenPoints(tl, tr), this._distanceBetweenPoints(tl, bl));

        const sc = psiz.divide(sz);
        const scale = Math.max(sc.x, sc.y);

        this.scale(new Point(0, 0), scale);
        this.centreinparent(true, pars);
        this.straighten();

        return this;
    }

    /**
     * Gets the boundingClientRect for supplied element.
     * @param {HTMLElement} el
     */
    _getRect(el) {
        return el.getBoundingClientRect();
    }

    /**
     * Resets the transformation to its starting value. Undoing all changes since instantiation.
     * @param {Boolean} trans Specify if a transition should be used
     */
    reset(trans) {
        if (!this.InitialMatrix) {
            this.matrix.reset();
        } else {
            this.matrix.elements = [...this.InitialMatrix];
        }

        this.setTransition(trans ?? true);
        if (this.transition) {
            if (this.delta?.x || this.delta?.y) { // has moved so will transition
                this.element.classList.add('transformable-reset');
                this.on(this.element, 'transitionend.reset', () => {
                    this.element.classList.remove('transformable-reset');
                    this.off(this.element, 'transitionend.reset');
                });
            }
        }
        this._updateElement();
        return this;
    }
    
    /**
     * Returns true if the undo stack contains a saved state named k
     * @param {String} k
     */
    hasHistoryKey(k) {
        return Array.isArray(this.matrix.history.undo[k]);
    }
    
    /**
     * Undo the last transformation or go back to a named state.
     * @param {String} k Optional: the name of a saved state to go back to
     */
    undo(k) {
        this.matrix.undo(k);
        this.setTransition(true);
        this._updateElement();
        return this;
    }

    /**
     * Redo the last thing that was undone.
     */
    redo() {
        this.matrix.redo();
        this.setTransition(true);
        this._updateElement();
        return this;
    }

    /**
     * Sets initial sizes and positions of the element and window
     */
    setInitialSizes() {
        if (this.sizes) return;
        
        const cs = window.getComputedStyle(this.element);
        const w = parseFloat(cs.width);
        const h = parseFloat(cs.height);
        const l = parseFloat(cs.left);
        const t = parseFloat(cs.top);

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
        };
    }

    /**
     * Gets the offset of an element taking in to account scroll position of the window
     * @param {HTMLElement} el Element to check
     */
    _getOffset(el) {
        const cr = this._getRect(el);
        const scroll = this.Ancestry._getScroll();
        const cs = getComputedStyle(el);
        const pos = new Point(parseFloat(cs.left), parseFloat(cs.top));
        const os = new Point(cr.left + scroll.x, cr.top + scroll.y);
        const br = new Point(cr.right, cr.bottom);
        const tr = new Point(cr.right, cr.top);
        const bl = new Point(cr.left, cr.bottom);

        return { offset: os, topleft: os, bottomright: br, topright: tr, bottomleft: bl, pos: pos };
    }
    
    /**
     * Sets the initial offset.  
     */
    _setOffset() {
        if (!this.offset) {
            const too = this._getOffset(this.element, true);
            this.offset = too.offset;
            this.initialoffset = too.offset;
        }
    }
    
    /**
     * Convert a string representation of a CSS transformation matrix in to an Array
     * @param {String} t The CSS transformation
     */
    _cssStringToArray(t) {
        const match = t.match(/[0-9e., -]+/);
        if (!match) return [];
        return match[0].split(", ").map(v => parseFloat(v));
    }
    
    /**
     * Converts a 6 element Array in to a CSS transformation string.
     * @param {Array} a 
     */
    _arrayToCssString(a) {
        return `matrix(${a.join(',')})`;
    }

    /**
     * Creates a Matrix for the transformable element. 
     * Cancels out any CSS that affects the offset or position of the element and converts to an equivalent CSS transformation matrix.
     * @param {HTMLElement} el
     */
    _getMatrix(el) {
        const elem = el || this.element;
        const cs = getComputedStyle(elem);
        const pcs = getComputedStyle(this.parent);
        const { transform: t, top: csTop, left: csLeft, marginTop, marginLeft, borderTopWidth, borderLeftWidth } = cs;
        
        const top = csTop.includes('%') ? (parseFloat(pcs.height) * parseFloat(csTop) / 100) : parseFloat(csTop);
        const left = csLeft.includes('%') ? (parseFloat(pcs.width) * parseFloat(csLeft) / 100) : parseFloat(csLeft);
        const margintop = parseFloat(marginTop);
        const marginleft = parseFloat(marginLeft);
        const bordertop = parseFloat(borderTopWidth);
        const borderleft = parseFloat(borderLeftWidth);

        let mElements;
        if (/matrix\(-?[0-9e., -]+\)/.test(t)) {
            mElements = this._cssStringToArray(t);
            if (!this.InitialMatrix) {
                this.InitialMatrix = [...mElements];
            }
        }
        
        const m = new Matrix(mElements || [1, 0, 0, 1, 0, 0]);
        
        if (left || top || margintop || marginleft || bordertop || borderleft) {
            m.translate(left || 0, top || 0);
            m.translate(marginleft || 0, margintop || 0);
            m.translate(borderleft || 0, bordertop || 0);
            Object.assign(elem.style, {
                marginTop: '0px',
                marginLeft: '0px',
                top: '0px',
                left: '0px'
            });
            elem.style.marginTop = (-(bordertop || 0)) + 'px';
            elem.style.marginLeft = (-(bordertop || 0)) + 'px';

            this.matrix = m;
            this._updateElement();
            this.InitialMatrix = [...m.elements];
        }
        return m;
    }

    /**
     * Sets the transition to use for transforms. 
     * Retains any existing transition originally set by CSS
     * @param {Boolean} bool If true will use a transition
     */
    setTransition(bool) {
        if (typeof bool !== 'boolean' || this.transition === bool) return;

        const currentSplits = this.originalTransition ? this.originalTransition.split(',') : [];
        if (bool) {
            currentSplits.push('transform 0.5s');
        } else {
            currentSplits.push('transform 0s');
        }
        this.element.style.transition = currentSplits.join(',');
        this.transition = bool;
    }

    /**
     * Sets the CSS transform on the element.
     */
    _updateElement() {
        this.element.style.transform = `matrix(${this.matrix.elements.join(',')})`;
    }

    /**
     * Adds the current matrix to the undo stack.
     */
    _pushhistory() {
        this.matrix.save();
    }

    /**
     * Sets the matrix property on this instance and applies the CSS.
     * @param {Matrix} m
     */
    _setMatrix(m) {
        this.matrix = m;
        this._updateElement();
    }

    /**
     * Gets the window coordinates of a mouse or touch event.
     * Also gets the angle and centre point between two touches
     * * @param {Event} e
     * @param {Array} touches
     */
    _getPageXY(e, touches) {
        let xy, ang, p1, p2;
        if (touches) {
            if (touches.length === 2) {
                xy = this._getMiddle(touches);
                ang = this._getRotation(touches);
                p1 = new Point(touches[0].pageX, touches[0].pageY);
                p2 = new Point(touches[1].pageX, touches[1].pageY);
            } else {
                xy = new Point(touches[0].pageX, touches[0].pageY);
                ang = this.matrix.rotation();
            }
        } else {
            xy = new Point(e.pageX, e.pageY);
            ang = this.matrix.rotation();
        }
        return { point: xy, angle: ang, p1, p2 };
    }

    /**
     * Gets offset (point in element coordinate space), 
     * window coordinates of the event and angle, distance and centre between two touches.
     * @param {Event} e
     * @param {Array} touches
     */
    _getPoint2(e, touches) {
        const dat = this._getPageXY(e, touches);
        const anc = this.Ancestry;
        const pars = anc.GetParents();
        const op = anc.OffsetFromPoint(dat.point, pars);
        const dist = dat.p1 && dat.p2 ?
            this._distanceBetweenPoints(
                anc.OffsetFromPoint(dat.p1, pars),
                anc.OffsetFromPoint(dat.p2, pars)
            ) : 0;

        let deltaXY = null;
        if (typeof e.deltaX !== 'undefined') {
            deltaXY = new Point(e.deltaX, e.deltaY);
        }

        return {
            offset: op,
            pageXY: dat.point,
            pageX: dat.point.x,
            pageY: dat.point.y,
            angle: dat.angle,
            distance: dist,
            deltaXY
        };
    }

    /**
     * Calculates the distance between two points
     * @param {Point} a First point
     * @param {Point} b Second point
     */
    _distanceBetweenPoints(a, b) {
        const prop = a.pageX ? { x: 'pageX', y: 'pageY' } : { x: 'x', y: 'y' };
        return Math.sqrt(Math.pow(Math.abs(b[prop.x] - a[prop.x]), 2) + Math.pow(Math.abs(b[prop.y] - a[prop.y]), 2));
    }

    /**
     * Gets the centre point between two touches
     * @param {Array} touches
     */
    _getMiddle(touches) {
        const [touch1, touch2] = touches;
        const mx = ((touch2.pageX - touch1.pageX) / 2) + touch1.pageX;
        const my = ((touch2.pageY - touch1.pageY) / 2) + touch1.pageY;
        return new Point(mx, my);
    }

    /**
     * Gets distance between two touch points (in the window) relative to the element.
     * @param {Array} touches
     * @param {Array} pars
     */
    _getDistance2(touches, pars) {
        const anc = this.Ancestry;
        const parentElements = pars || anc.GetParents();
        const t1 = anc.OffsetFromPoint(new Point(touches[0].pageX, touches[0].pageY), parentElements);
        const t2 = anc.OffsetFromPoint(new Point(touches[1].pageX, touches[1].pageY), parentElements);
        return this._distanceBetweenPoints(t1, t2);
    }

    /**
     * Gets the angle in degrees between two touch points
     * @param {Array} touches
     * @param {Boolean} norm Optional: Normalise to be 0-365 degrees
     */
    _getRotation(touches, norm) {
        const r = Math.atan2((touches[0].pageY || touches[0].y) - (touches[1].pageY || touches[1].y), (touches[0].pageX || touches[0].x) - (touches[1].pageX || touches[1].x)) * 180 / Math.PI;
        return norm ? this.matrix.normaldegree(r) : r;
    }
    
    /**
     * Snaps the rotation to a multiple of 15 degrees if within 3 degrees of a multiple of 15 degrees.
     */
    snapRotation() {
        if (this.options.disable?.rotate) return;

        let r = this.matrix.rotation();
        const m = r - (15 * Math.round(r / 15));
        const am = Math.abs(m);
        const siz = this.sizes.element.initial;
        this.setTransition(true);

        if (am <= 3 && am > 0) {
            const pt = this.lastrotationpoint || new Point(siz.width / 2, siz.height / 2);
            this.rotate(pt, -m);
            this.lastlastrotationpoint = undefined;
            this._pushhistory();
        }
        
        r = this.matrix.rotation();
        let msg;
        switch (Math.abs(Math.round(r * 10) / 10)) {
            case 0:
            case 180:
                msg = 'Horizontal';
                break;
            case 90:
                msg = 'Vertical';
                break;
            default:
                msg = `Rotation: ${Math.round(r * 10) / 10}&deg;`;
        }
        this.showMessage(msg, 'sticky', 2000);
    }
    
    /**
     * Writes info to the console
     * @param {String} m
     * @param {any} c Not implemented
     * @param {any} t Not implemented
     */
    showMessage(m, c, t) {
        console.log(m);
    }

    /**
     * Gets the centre point of the element in window coordinates
     */
    _findCentreInWindow() {
        const prect = this._getRect(this.parent);
        return new Point(prect.left + prect.width / 2, prect.top + prect.height / 2);
    }

    /**
     * Centres the element in the middle of its parent element
     * @param {Boolean} transition Optional
     * @param {Array} pars Optional but should always be supplied
     */
    centreinparent(transition, pars) {
        const was = this.transition;
        this.setTransition(transition);
        const parentElements = pars || this.Ancestry.GetParents();
        const pcs = getComputedStyle(this.parent);
        const parentCentre = new Point(parseFloat(pcs.width) / 2, parseFloat(pcs.height) / 2);
        const centreOnThis = this.matrix.inverse().transformpoint(parentCentre);
        this.translate(centreOnThis.sub(new Point(this.sizes.element.initial.width / 2, this.sizes.element.initial.height / 2)));
        this.setTransition(was);
    }

    /**
     * Find out if point p is within the rectangle defined by points a,b,c,d
     * @param {Point} p
     * @param {Point} a
     * @param {Point} b
     * @param {Point} c
     * @param {Point} d
     */
    pointInRectangle(p, a, b, c, d) {
        const ab = b.sub(a);
        const ap = p.sub(a);
        const bc = c.sub(b);
        const bp = p.sub(b);
        const dot_abap = ab.dot(ap);
        const dot_abab = ab.dot(ab);
        const dot_bcbp = bc.dot(bp);
        const dot_bcbc = bc.dot(bc);
        return {
            dot_abap,
            dot_abab,
            dot_bcbp,
            dot_bcbc,
            ok: 0 <= dot_abap && (Math.round(dot_abap * 10) / 10) <= (Math.round(dot_abab * 10) / 10) && 0 <= dot_bcbp && (Math.round(dot_bcbp * 10) / 10) <= (Math.round(dot_bcbc * 10) / 10)
        };
    }
    
    /**
     * Triggers an event named n. 
     * In the handler, this will refer to the Transformable instance.
     * The handler will receive the transformable element as first argument and a real event object as the second argument.
     * @param {String} n
     * @param {Event} event Pass in a real event object if you have one
     */
    trigger(n, event) {
        if (typeof this.events[n] === "function") {
            this.events[n].call(this, this.element, event);
        }
    }

    /**
     * Gets the points data needed to make rotation handles work
     * @param {Event} e
     * @param {Array} pars
     */
    _getRotatorPoints(e, pars) {
        const anc = this.Ancestry;
        const parentElements = pars || anc.GetParents();
        anc._setoffset();
        const touches = e.touches;
        const rpoint = touches ? new Point(touches[0].pageX, touches[0].pageY) : new Point(e.pageX, e.pageY);
        const apoint = this.anchor.TL;
        const angle = Math.round(this._getRotation([apoint.add(anc.scroll), rpoint], false) * 100) / 100;
        return {
            deltaXY: null,
            offset: anc.OffsetFromPoint(rpoint, parentElements),
            pageXY: rpoint,
            pageX: rpoint.x,
            pageY: rpoint.y,
            angle: angle,
            distance: 0
        };
    }
    
    /**
     * Attaches events for rotation interactions with rotation handles
     * @param {HTMLElement} hdl The element to use as a rotation handle
     */
    _addRotateEvents(hdl) {
        const _dostart = e => {
            if (this.options.disabled || this.startedresize) return;
            
            if(document.querySelectorAll('.transformable-active').length == 0)
                this.element.classList.add('transformable-active');

            const m = this.matrix;
            this.origrotate = {
                trans: new Point(m.elements[4], m.elements[5]),
                angle: m.rotation(true),
                scale: m.scaling(),
            };

            const touches = e.touches;
            if (touches?.length === 2)
                if (touches[0].target && touches[1].target)
                    if (touches[0].target !== touches[1].target) {
                        console.log('Two active elements not supported');
                        return false;
                    }

            this.anchor = this.anchor || {};
            this.anchor.clientRect = this._getRect(this.element.querySelector('.transformable-anchor-point'));
            this.anchor.TL = new Point(this.anchor.clientRect.left, this.anchor.clientRect.top);
            this.startrotate = this._getRotatorPoints(e);
            this.startrotate.scale = this.origrotate.scale;
            this.startedrotate = true;
            this.draggingrotate = false;
            this.setTransition(false);
            e.stopPropagation();

            if (e.type === 'mousedown') {
                this.on(document.body, 'mousemove.transformable', _domove);
                this.on(document.body, 'mouseup.transformable dragend.transformable', _dostop);
            }
        };

        const _domove = e => {
            if (!this.startedrotate) return;
            this.draggingrotate = true;
            e.preventDefault();
            e.stopPropagation();
            if (e.touches?.length === 2) return;

            const point = this._getRotatorPoints(e);
            const delta = { angle: Math.round((point.angle - this.startrotate.angle) * 100) / 100 };
            
            if (delta.angle !== 0) {
                if (this.parent !== this.options.rotatetarget.element) {
                    this.matrix.rotateAboutPoint(new Point(0), delta.angle);
                    this._updateElement();
                }
                if (this.options.rotatetarget instanceof Transformable) {
                    this.options.rotatetarget.rotate(this.anchor.TL.add(this.Ancestry.scroll), delta.angle, false, true);
                }
            }
            this.startrotate.angle = point.angle;
        };
        
        const _dostop = e => {
            e.preventDefault();
            e.stopPropagation();
            this.element.classList.remove('transformable-active');
            this.startedrotate = false;
            this.draggingrotate = false;
            this.off(document.body, 'mouseup.transformable dragend.transformable');

            if (this.options.rotatetarget instanceof Transformable) {
                if (this.options.rotatetarget.events.stop)
                    this.options.rotatetarget.trigger('stop', e);

                this.options.rotatetarget.snapRotation();
            }
            if (this.events.stop)
                this.trigger('stop', e);

            this.snapRotation();
        };

        this.on(hdl, 'mousedown.transformable touchstart.transformable', _dostart);
        this.on(hdl, 'touchmove.transformable', _domove);
        this.on(hdl, 'touchend.transformable', _dostop);
    }

    /**
     * Attaches events for resize interactions with resize handles
     * @param {HTMLElement} tlb Top left button/handle used for moving the element
     * @param {HTMLElement} brb Bottom right button/handle for resizing the element's width/height
     */
    _addResizeEvents(tlb, brb) {
        const _dostart = e => {
            if (!document.querySelector('.transformable-active')) {
                this.element.classList.add('transformable-active');
            }
            e.preventDefault();
            e.stopPropagation();
            const m = this.matrix;
            this.origresize = {
                trans: new Point(m.elements[4], m.elements[5]),
                angle: m.rotation(),
                scale: m.scaling()
            };
            this.startresize = this._getPoint2(e, e.touches);
            this.startresize.scale = this.origresize.scale;
            this.startedresize = true;
            this.draggingresize = false;
            const cs = getComputedStyle(this.element);
            this.h = parseFloat(cs.height);
            this.w = parseFloat(cs.width);
            this.contained = this.contained ?? true;
            this.trigger('startresize', e);
            this.setTransition(false);
            if (e.type === 'mousedown') {
                this.on(document.body, 'mousemove.transformable', _domove);
                this.on(document.body, 'mouseup.transformable dragend.transformable', _dostop);
            }
        };

        const _domove = e => {
            if (!this.element.classList.contains('transformable-active') || !this.startedresize) return;
            this.draggingresize = true;
            e.preventDefault();
            e.stopPropagation();
            if (e.touches?.length === 2) return;

            const point = this._getPoint2(e, e.touches);
            const start = this.startresize;
            const delta = { 
                trans: point.offset.sub(this.startresize.offset),
                angle: Math.round((point.angle - start.angle) * 100) / 100,
                distance: start.distance != 0 ? Math.round(point.distance / ((start.distance + point.distance)/2) * 1000) / 1000 : 0
            };

            if (delta.trans.nonzero()) {
                const cs = getComputedStyle(this.element);
                const h = parseFloat(cs.height);
                const w = parseFloat(cs.width);
                const dw = this.w - w;
                const dh = this.h - h;
                const neww = w + delta.trans.x + dw;
                const newh = h + delta.trans.y + dh;
                this.element.style.width = `${neww}px`;
                this.element.style.height = `${newh}px`;
                this.sizes.element.initial.bottomright = new Point(neww, newh);
                this.sizes.element.initial.topright.x = neww;
                this.sizes.element.initial.bottomleft.y = newh;
                this.sizes.element.initial.width = neww;
                this.sizes.element.initial.height = newh;
            }
            this.startresize.angle = point.angle;
        };

        const _dostop = () => {
            this.off(document.body, 'mousemove.transformable', _domove);
            this.off(document.body, 'mouseup.transformable dragend.transformable', _dostop);
            if (this.options.disabled) return;
            this.element.classList.remove('transformable-active');
            this.startedresize = false;
            this.draggingresize = false;
        };

        this.on(brb, 'mousedown.transformable', _dostart);
        this.on(brb, 'touchstart.transformable', _dostart);
        this.on(brb, 'touchmove.transformable', _domove);
        this.on(brb, 'touchend.transformable', _dostop);
    }
    
    /**
     * Gets the quadrant based on angle r and wether the angle is horizontal or vertical
     * @param {Number} r
     */
    getRotationQuadrant(r) {
        const rot = (r ?? this.matrix.rotation()) % 360;
        const normalizedRot = rot < 0 ? rot + 360 : rot;
        return { Angle: normalizedRot, Quad: Math.floor(normalizedRot / 90), Horiz: normalizedRot === 0 || normalizedRot === 180, Vert: normalizedRot === 90 || normalizedRot === 270 };
    }
    
    /**
     * Attaches events for scaling, rotating and moving elements. 
     * Calculates and applies containment too.
     */
    _addEvents() {
        if (typeof this.events.transition === 'function') {
            this.element.addEventListener('transitionend', this.events.transition);
        }

        const _dostart = e => {
            if (this.options.disabled || this.startedresize || this.startedrotate) return;
            if (!document.querySelector('.transformable-active')) {
                this.element.classList.add('transformable-active');
            }
            if (this.options.type === 'rotator-box') {
                const rb = e.target.closest('svg');
                if (rb && !rb.classList.contains('transformable-svg-anchor')) 
                    return false;
                else
                    e.stopPropagation();
            }

            const touches = e.touches;
            this.start = this._getPoint2(e, touches);
            const ww = this.sizes.window;
            if (this.start.pageX < 40 || this.start.pageX > ww.width - 40) { // don't translate if history navigation can happen from swiping at the edges of webpage.  e.g. on a touch device
                console.log('edge cancel.');
                return false;
            }
            this.delta = { x: 0, y: 0 };
            if (touches?.length === 2) 
                if (touches[0].target && touches[1].target)
                    if (touches[0].target !== touches[1].target) {
                        console.log('Two active elements not supported');
                        return false;
                    }

            const m = this.matrix;
            this.orig = {
                trans: new Point(m.elements[4], m.elements[5]),
                angle: m.rotation(),
                scale: m.scaling(),
            };
            this.start.scale = this.orig.scale;
            this.started = true;
            this.dragging = false;

            if (this.events.start)
                this.trigger('start', e);

            this.setTransition(false);

            if (e.type === 'mousedown') {
                this.on(document.body, 'mousemove.transformable', _domove);
                this.on(document.body, 'mouseup.transformable dragend.transformable', _dostop);
            }
        };

        const _domove = e => {
            if (this.options.disabled || !this.element.classList.contains('transformable-active') || !this.started || this.startedresize || this.startedrotate) return false;
            this.dragging = true;
            e.preventDefault();
            e.stopPropagation();
            
            // Note: The logic for containment in this method is extremely complex and has been kept as close to the original as possible during refactoring.
            // Modernizing it further would require a deep re-architecture of the containment algorithm itself.
            const touches = e.touches;
            let doupdate = false;

            if (touches?.touches.length == 2)
                if (touches[0].target && touches[1].target)
                    if (touches[0].target !== touches[1].target) {
                        console.log('Two active elements not supported');
                        return false;
                    }

            const m = this.matrix;
            const disable = this.options.disable;
            const docontain = this.options && this.options.contain;

            const disableZoom = disable?.zoom || disable?.scale;
            const disableRotate = disable?.rotate;
            const disableTranslate = disable?.translate;

            const point = this._getPoint2(e, touches);
            const orig = this.orig;
            const start = this.start;
            const delta = {
                trans: point.offset.sub(start.offset),
                angle: Math.round((point.angle - start.angle) * 100) / 100,
                distance: start.distance !== 0 ? Math.round(point.distance / ((start.distance + point.distance) / 2) * 1000) / 1000 : 0
            };

            var that = this;

            if (docontain && delta.angle == 0 && (!touches || (touches && touches.length == 1))) 
            {
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

        };
        
        const _dostop = e => {
            this.off(document.body, 'mousemove.transformable', _domove);
            this.off(document.body, 'mouseup.transformable dragend.transformable', _dostop);

            this.element.classList.remove('transformable-active', 'transformable-reset');

            if (this.options.disabled) return false;

            this.lockcontain = false;
            if (this.started && this.dragging) {
                this._pushhistory();
                this.snapRotation();
            }
            if (this.started && !this.dragging) {
                this.trigger('tap', e);
            }
            this.dragging = false;
            this.started = false;
            if (this.events.stop)
                this.trigger('stop', e);

            this.setTransition(true);

            // Scale handles on stop
            
            var that = this;
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
        };
        
        const _dowheelzoom = e => {
            if (this.options.disabled || this.startedresize || this.startedrotate || this.options.type === 'rotator-box') return false;
            
            e.preventDefault();
            e.stopPropagation();

            const now = Date.now();
            const dmw = this.lastwheelmove ? now - this.lastwheelmove : 150;

            if (dmw < 150 && navigator.userAgent.includes('Mac')) return false;
            
            if (!document.querySelector('.transformable-active')) {
                this.element.classList.add('transformable-active');
            }
            if (this.rotatorBox) {
                this.rotatorBox.parent.classList.add('transformable-wheel-active');
            }
            if (this._wheelTimer) clearTimeout(this._wheelTimer);

            const point = this._getPoint2(e);
            const m = this.matrix;
            
            this.setTransition(true);

            if (point.deltaXY.y !== 0) {
                const acc = point.deltaXY.y < 0 ? 1 : -1;
                const ds = 1 + (0.05 * acc);
                m.scale(point.offset, ds);
                this._updateElement();
            }
            this.element.classList.remove('transformable-active');

            this._wheelTimer = setTimeout(() => {
                this._pushhistory();
                if (this.rotatorBox) {
                    this.rotatorBox.parent.classList.remove('transformable-wheel-active');
                }
            }, 750);
            this.lastwheelmove = now;
        };

        this.on(this.element, 'mousedown.transformable', _dostart);
        this.on(this.element, 'touchstart.transformable', _dostart);
        this.on(this.element, 'touchmove.transformable', _domove);
        this.on(this.element, 'touchend.transformable', _dostop);
        
        this.on(this.element, 'scroll.transformable', e => { 
            console.log('tried scroll');
            e.preventDefault(); e.stopPropagation(); return false; 
        });

        if (!this.options.disable || this.options.disable?.wheel)
            if (!navigator.userAgent.includes('Mac OS')) // some issues with wild zoom on magic mouse, so turn it off
                addWheelListener(this.element, _dowheelzoom);
    }

    /**
     * attaches events to an element
     * @param {HTMLElement} el The element to attach the event to
     * @param {String} event Type of event with optional namespace. E.g. touchstart.mynamespace
     * @param {Function} func Handler function
     * @param {Object} opts Options to use when attaching the event
     */
    on(el, event, func, opts) {
        //const events = event.split(' ');
        //for (const evt of events) {
        //    const [ev, ns] = evt.split('.');
        //    el.addEventListener(ev, func, opts || false);

        //    Transformable.Handlers.Namespaces[evt] = Transformable.Handlers.Namespaces[evt] || [];
        //    if (ns) Transformable.Handlers.Namespaces[ns] = Transformable.Handlers.Namespaces[ns] || [];
            
        //    const handler = { event: ev, func, opts: opts || false };
        //    Transformable.Handlers.Namespaces[evt].push(handler);
        //    if (ns) Transformable.Handlers.Namespaces[ns].push(handler);
        //}

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
    }

    /**
     * Removes an event previously added with .on(...)
     * @param {HTMLElement} el The element to remove the event from
     * @param {String} event Handler function to remove
     * @param {Object} opts Options to use when removing the event
     */
    off(el, event, opts) {
        const handlers = Transformable.Handlers.Namespaces[event];
        if (handlers) {
            for (const handler of handlers) {
                el.removeEventListener(handler.event, handler.func, handler.opts || false);
            }
        }
    }

    /**
     * Resets/updates the instance.
     */
    Refresh() {
        this.sizes = undefined;
        this.setInitialSizes();
        this.Ancestry.Refresh();
    }
};

(() => {        
    let timer;
    const refreshtransformables = () => { 
        document.querySelectorAll('.transformable').forEach(v => {
            const i = v.getAttribute('data-transformable-id');
            const t = i ? Transformable.Instance[i] : null;

            if (t instanceof Transformable) {
                t.Refresh();
            }
        });
    };
    
    window.addEventListener('resize', () => {
        clearTimeout(timer);
        timer = setTimeout(refreshtransformables, 150);
    });
})();
// Ensure Transformable is available as a global for UMD/browser builds
if (typeof window !== 'undefined') {
  window.Transformable = Transformable;
}
export default Transformable;