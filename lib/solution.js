'use strict';

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _products = require('./products');

var _products2 = _interopRequireDefault(_products);

var _listings = require('./listings');

var _listings2 = _interopRequireDefault(_listings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fs = (0, _promisifyNode2.default)("fs");

var getKeywords = function getKeywords(list) {
  return list.reduce(function (prev, attr) {
    return prev.concat(attr.split(" "));
  }, []);
};
var createResult = function createResult(product) {
  return {
    product_name: product.product_name,
    listings: product.listings
  };
};

var main = function main() {
  var products = new _products2.default();
  var listings = new _listings2.default();

  return Promise.all([products.ready(), listings.ready()]).then(function () {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = listings.listings[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var listing = _step.value;

        products.addListing(listing, getKeywords([listing.manufacturer, listing.title]));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    fs.writeFile(_path2.default.join(__dirname, '../data/results.txt'), products.map(createResult).map(JSON.stringify).join("\n"), 'utf8');
  });
};

if (require.main === module) {
  main().then(function () {
    return console.log("File created at ./data/results.txt");
  }).catch(function (err) {
    return console.log("Ups, there's an error!", err);
  });
}