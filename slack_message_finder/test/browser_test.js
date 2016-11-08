'use strict';
const angular = require('angular');

require('angular-mocks');
require('../app/js/client');

describe('controller tests', ()=>{

  let ctrlVar1

  it('should run a test', ()=>{
    expect(true).toBe(true);
  });

  beforeEach(()=>{
    angular.mock.module('YourApp');
    angular.mock.inject(function($controller){
      ctrlVar1 = new $controller('YourController');
    });
  });

  it('should test your controller', ()=>{
    expect(ctrlVar1.someBooleanProperty).toBe(true);
  });

});
