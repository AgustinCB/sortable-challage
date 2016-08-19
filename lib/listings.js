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

var fs = void 0;

var Listings = function () {
  function Listings() {
    var _this = this;

    _classCallCheck(this, Listings);

    fs = (0, _promisifyNode2.default)("fs");

    this.readyProm = fs.readFile(_path2.default.join(__dirname, '../data/listings.txt'), 'utf8').then(function (listings_string) {
      _this.listings = listings_string.split("\n").filter(function (p) {
        return !!p;
      }).map(JSON.parse);
    }).catch(function (err) {
      return console.log("Ups, there's an error!", err);
    });
  }

  _createClass(Listings, [{
    key: 'ready',
    value: function ready() {
      return this.readyProm;
    }
  }]);

  return Listings;
}();

exports.default = Listings;
;