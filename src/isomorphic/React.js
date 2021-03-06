/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule React
 */

'use strict';

var ReactChildren = require('ReactChildren');
var ReactComponent = require('ReactComponent');
var ReactPureComponent = require('ReactPureComponent');
var ReactClass = require('ReactClass');
var ReactDOMFactories = require('ReactDOMFactories');
var ReactElement = require('ReactElement');
var ReactPropTypes = require('ReactPropTypes');
var ReactVersion = require('ReactVersion');

var onlyChild = require('onlyChild');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (__DEV__) {
  var lowPriorityWarning = require('lowPriorityWarning');
  var canDefineProperty = require('canDefineProperty');
  var ReactElementValidator = require('ReactElementValidator');
  var didWarnPropTypesDeprecated = false;
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = Object.assign;
var createMixin = function(mixin) {
  return mixin;
};

if (__DEV__) {
  var warnedForSpread = false;
  var warnedForCreateMixin = false;
  __spread = function() {
    lowPriorityWarning(
      warnedForSpread,
      'React.__spread is deprecated and should not be used. Use ' +
        'Object.assign directly or another helper function with similar ' +
        'semantics. You may be seeing this warning due to your compiler. ' +
        'See https://fb.me/react-spread-deprecation for more details.',
    );
    warnedForSpread = true;
    return Object.assign.apply(null, arguments);
  };

  createMixin = function(mixin) {
    lowPriorityWarning(
      warnedForCreateMixin,
      'React.createMixin is deprecated and should not be used. You ' +
        'can use this mixin directly instead.',
    );
    warnedForCreateMixin = true;
    return mixin;
  };
}

var React = {
  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild,
  },

  Component: ReactComponent,
  PureComponent: ReactPureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: createMixin,

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread,
};

// TODO: Fix tests so that this deprecation warning doesn't cause failures.
if (__DEV__) {
  if (canDefineProperty) {
    Object.defineProperty(React, 'PropTypes', {
      get() {
        lowPriorityWarning(
          didWarnPropTypesDeprecated,
          'Accessing PropTypes via the main React package is deprecated. Use ' +
            'the prop-types package from npm instead.',
        );
        didWarnPropTypesDeprecated = true;
        return ReactPropTypes;
      },
    });
  }

  // React.DOM factories are deprecated. Wrap these methods so that
  // invocations of the React.DOM namespace and alert users to switch
  // to the `react-addons-dom-factories` package.
  React.DOM = {};
  var warnedForFactories = false;
  Object.keys(ReactDOMFactories).forEach(function(factory) {
    React.DOM[factory] = function(...args) {
      if (!warnedForFactories) {
        lowPriorityWarning(
          false,
          'Accessing factories like React.DOM.%s has been deprecated ' +
            'and will be removed in the future. Use the ' +
            'react-addons-dom-factories package instead.',
          factory,
        );
        warnedForFactories = true;
      }
      return ReactDOMFactories[factory](...args);
    };
  });
}

module.exports = React;
