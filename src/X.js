/*
 *
 *                  xxxxxxx      xxxxxxx
 *                   x:::::x    x:::::x
 *                    x:::::x  x:::::x
 *                     x:::::xx:::::x
 *                      x::::::::::x
 *                       x::::::::x
 *                       x::::::::x
 *                      x::::::::::x
 *                     x:::::xx:::::x
 *                    x:::::x  x:::::x
 *                   x:::::x    x:::::x
 *              THE xxxxxxx      xxxxxxx TOOLKIT
 *
 *                  http://www.goXTK.com
 *
 * Copyright (c) 2013 The X Toolkit Developers <dev@goXTK.com>
 *
 *    The X Toolkit (XTK) is licensed under the MIT License:
 *      http://www.opensource.org/licenses/mit-license.php
 *
 *      "Free software" is a matter of liberty, not price.
 *      "Free" as in "free speech", not as in "free beer".
 *                                         - Richard M. Stallman
 *
 *
 */

goog.provide('X');

/**
 * The XTK namespace.
 *
 * @const
 */
var X = X || {};

/**
 * The version information.
 *
 * @type {!string}
 * @public
 */
X.version = '0.0.1';

/**
 * The counter for unique ids.
 *
 * @type {!number}
 * @public
 */
X.counter = 0;

/**
 * @inheritDoc
 */
X.__super__ = goog.base;

/**
 * @inheritDoc
 */
X.__extends__ = goog.inherits;

/**
 * Can be used to check if the XTK library was compiled.
 *
 * <pre>
 * if (X.DEV === undefined) {
 *   // xtk was compiled
 * }
 * </pre>
 *
 * @type {boolean}
 */
X.DEV = true;

/**
 * Timer functionality which can be used in developer mode to clock certain
 * things.
 *
 * <pre>
 * X.TIMER(this._classname+'.functionname');
 *
 * ... stuff is happening
 * </pre>
 *
 * @param {string} what The title of this timer.
 */
X.TIMER = function(what) {

  if (eval('X.DEV === undefined')) {
    return;
  }

  window.console.time(what);

};

/**
 * Timer functionality which can be used in developer mode to clock certain
 * things.
 *
 * <pre>
 * ... stuff was happening
 *
 * X.TIMERSTOP(this._classname+'.functionname');
 * </pre>
 *
 * @param {string} what The title of this timer.
 */
X.TIMERSTOP = function(what) {

  if (eval('X.DEV === undefined')) {
    return;
  }

  window.console.timeEnd(what);

};


//make sure we don't overwrite a $ sign to ensure compatibility with jQuery
var $ = window.$;

//
// BROWSER COMPATIBILITY FIXES GO HERE
//
//
//1. Safari does not support the .bind(this) functionality which is crucial for
//XTK's event mechanism. This hack fixes this.
//
function bind_shim() {

  if ( !Function.prototype.bind ) {

    Function.prototype.bind = function(oThis) {

      if ( typeof this !== "function" ) {
        // closest thing possible to the ECMAScript 5 internal IsCallable
        // function
        throw new TypeError(
            "Function.prototype.bind - what is trying to be bound is not callable");
      }

      var fSlice = Array.prototype.slice, aArgs = fSlice.call(arguments, 1), fToBind = this;

      /**
       * @constructor
       */
      var fNOP = function() {

      };

      var fBound = function() {

        return fToBind.apply(this instanceof fNOP ? this : oThis || window,
            aArgs.concat(fSlice.call(arguments)));
      };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }

}


//http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

//requestAnimationFrame polyfill by Erik M�ller
//fixes from Paul Irish and Tino Zijdel
//
//from: https://gist.github.com/1579671

function requestAnimationFrame_shim() {

(function() {

 var lastTime = 0;
 var vendors = ['ms', 'moz', 'webkit', 'o'];
 for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
   window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
   window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
       window[vendors[x] + 'CancelRequestAnimationFrame'];
 }

 if (!window.requestAnimationFrame) {
   window.requestAnimationFrame = function(callback, element) {

     var currTime = Date.now(); // changed this to avoid new object each time
     var timeToCall = Math.max(0, 16 - (currTime - lastTime));
     var id = window.setTimeout(function() {

       callback(currTime + timeToCall);
     }, timeToCall);
     lastTime = currTime + timeToCall;
     return id;
   };
 }

 if (!window.cancelAnimationFrame) {
   window.cancelAnimationFrame = function(id) {

     clearTimeout(id);
   };
 }
}());

}


function arrayBufferSlice_shim() {

  // Copyright 2012 Google Inc. All Rights Reserved.
  // Author: jacobsa@google.com (Aaron Jacobs)
  //
  // Licensed under the Apache License, Version 2.0 (the "License");
  // you may not use this file except in compliance with the License.
  // You may obtain a copy of the License at
  //
  // http://www.apache.org/licenses/LICENSE-2.0
  //
  // Unless required by applicable law or agreed to in writing, software
  // distributed under the License is distributed on an "AS IS" BASIS,
  // WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  // See the License for the specific language governing permissions and
  // limitations under the License.

  // Attach a slice() method to ArrayBuffer, since our C++ implementation
  // doesn't
  // have one. A JS version is much easier to implement, though it won't be as
  // fast.

  // Don't attempt to replace an already-working slice method.
  if (!('slice' in ArrayBuffer.prototype)) {
    /**
     * Slice an array buffer, as defined here:
     * http://www.khronos.org/registry/typedarray/specs/latest/
     *
     * @param {number} start The start index, inclusive. If negative, this is
     *          interpreted as an index from the end of the array.
     * @param {number=} opt_end The end index, exclusive. If negative, this is
     *          interpreted as an index from the end of the array. If missing,
     *          this defaults to the length of the array.
     * @return {!ArrayBuffer} A copy of the sliced data.
     * @suppress {duplicate}
     */
    ArrayBuffer.prototype.slice = function(start, opt_end) {

      // Handle missing start arguments.
      if (start === undefined) {
        throw new Error('Not enough arguments.');
      }

      // Handle missing end arguments.
      var end = opt_end || this.byteLength;

      // Interpret negative values as indices from the end of the array. Convert
      // them to indices from the beginning.
      if (start < 0) {
        start = this.byteLength + start;
      }
      if (end < 0) {
        end = this.byteLength + end;
      }

      // Handle negative-length slices.
      if (end < start) {
        start = 0;
        end = 0;
      }

      // Clamp the range.
      if (start < 0) {
        start = 0;
      }
      if (end < 0) {
        end = 0;
      }

      if (start > this.byteLength) {
        start = this.byteLength;
      }
      if (end > this.byteLength) {
        end = this.byteLength;
      }

      // Create a new buffer, and copy data into it.
      var result = new ArrayBuffer(end - start);
      var inBytes = new Uint8Array(this);
      var outBytes = new Uint8Array(result);

      for ( var inIndex = start, outIndex = 0; inIndex < end; ++inIndex, ++outIndex) {
        outBytes[outIndex] = inBytes[inIndex];
      }

      return result;
    };
  }
}

//install the shims, if necessary
bind_shim();
arrayBufferSlice_shim();

goog.exportSymbol('$', $);
goog.exportSymbol('Function.prototype.bind', Function.prototype.bind);
goog.exportSymbol('window.requestAnimationFrame', window.requestAnimationFrame);
goog.exportSymbol('window.cancelAnimationFrame', window.cancelAnimationFrame);
goog.exportSymbol('X.counter', X.counter);
goog.exportSymbol('X.__extends__', X.__extends__);
goog.exportSymbol('X.__super__', X.__super__);
goog.exportSymbol('X.version', X.version);

