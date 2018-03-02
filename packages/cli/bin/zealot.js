#!/usr/bin/env node
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('@zealotdeploy/core')) :
	typeof define === 'function' && define.amd ? define(['@zealotdeploy/core'], factory) :
	(factory(global.core));
}(this, (function (core) { 'use strict';

core = core && core.hasOwnProperty('default') ? core['default'] : core;

console.log(core);

})));
