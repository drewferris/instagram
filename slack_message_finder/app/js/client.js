'use strict';

const angular = require('angular');
const ngRoute = require('angular-route');
const bootstrap = require('angular-ui-bootstrap');
const ngAnimate = require('angular-animate');
const ngSanitize = require('angular-sanitize');


const app = angular.module('InstaApp', [ngRoute, ngAnimate, ngSanitize, bootstrap]);

require('./controllers')(app);
require('./directives')(app);
