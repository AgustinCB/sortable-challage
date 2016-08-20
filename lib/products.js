'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var fs = void 0;

var PRODUCT_INDEXES = Object.freeze(["model", "manufacturer"]);

var _intersect = function _intersect(a, b) {
  var setA = new Set(a);
  var setB = new Set(b);
  var intersection = new Set([].concat(_toConsumableArray(setA)).filter(function (x) {
    return setB.has(x);
  }));
  return Array.from(intersection);
};

var Products = function () {
  function Products() {
    var _this = this;

    _classCallCheck(this, Products);

    fs = (0, _promisifyNode2.default)("fs");

    this.indexes = {};

    this.readyProm = fs.readFile(_path2.default.join(__dirname, '../data/products.txt'), 'utf8').then(function (products_string) {
      _this.products = products_string.split("\n").filter(function (p) {
        return !!p;
      }).map(JSON.parse);

      PRODUCT_INDEXES.forEach(function (new_index) {
        _this._createIndex(new_index);
        _this.products.forEach(function (product) {
          return _this._indexProduct(new_index, product);
        });
      });
    }).catch(function (err) {
      return console.log("Ups, there's an error!", err);
    });
  }

  _createClass(Products, [{
    key: 'ready',
    value: function ready() {
      return this.readyProm;
    }
  }, {
    key: 'addListing',
    value: function addListing(listing, keywords) {
      var _this2 = this;

      var modelProd = [];
      var manufacturerProd = [];

      keywords.forEach(function (keyword) {
        if (_this2.indexes["model"][keyword]) {
          modelProd = modelProd.concat(_this2.indexes["model"][keyword]);
        }
        if (_this2.indexes["manufacturer"][keyword]) {
          manufacturerProd = manufacturerProd.concat(_this2.indexes["manufacturer"][keyword]);
        }
      });

      var prod = this._pickBest(_intersect(modelProd, manufacturerProd), keywords);
      if (prod) this._addListing(prod, listing);
    }
  }, {
    key: 'map',
    value: function map(cb) {
      return this.products.map(cb);
    }
  }, {
    key: '_pickBest',
    value: function _pickBest(prods, keywords) {
      if (!prods.length) return undefined;
      if (prods.length == 1) return prods[0];

      var finalProd = prods.find(function (prod) {
        return keywords.indexOf(prod.family) > -1;
      });
      return finalProd ? finalProd : prods[0];
    }
  }, {
    key: '_addListing',
    value: function _addListing(product, listing) {
      if (!product.listings) product.listings = [];
      product.listings.push(listing);
    }
  }, {
    key: '_indexProduct',
    value: function _indexProduct(index, product) {
      var subIndex = product[index].toLowerCase();
      if (!this.indexes[index][subIndex]) this.indexes[index][subIndex] = [];
      this.indexes[index][subIndex].push(product);
    }
  }, {
    key: '_createIndex',
    value: function _createIndex(index) {
      this.indexes[index] = {};
    }
  }]);

  return Products;
}();

exports.default = Products;
;