'use strict';

const debug = require('debug')('shooter:barrel-controlller');
const httpErrors = require('http-errors');
const Barrel = require('../model/barrel-model');

exports.createBarrel = function(barrelData){
  debug('entered createBarrel in barrel-controller.js');
  return new Promise((resolve, reject) => {
    new Barrel(barrelData).save()
    .then(barrel => resolve(barrel))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.getBarrel = function(barrelId){
  debug('entered get-barrel');
  return new Promise((resolve, reject) => {
    Barrel.findOne({_id: barrelId})
    .then(barrel => resolve(barrel))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.deleteBarrel = function(barrelId){
  debug('entered deleteBarrel function');
  return new Promise((resolve, reject) => {
    Barrel.remove({_id: barrelId})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};
