'use strict'

import { default as promisify } from 'promisify-node'
import path from 'path'

let fs;

const PRODUCT_INDEXES = Object.freeze([
  "model",
  "manufacturer"
]);

const _intersect = (a, b) => {
  var setA = new Set(a)
  var setB = new Set(b)
  var intersection = new Set([...setA].filter(x => setB.has(x)))
  return Array.from(intersection)
};

export default class Products {
  constructor () {
    fs = promisify("fs")

    this.indexes = {}

    this.readyProm = fs.readFile(path.join(__dirname, '../data/products.txt'), 'utf8')
    .then((products_string) => {
      this.products = products_string.split("\n").filter((p) => !!p).map(JSON.parse)

      PRODUCT_INDEXES.forEach((new_index) => {
        this._createIndex(new_index)
        this.products.forEach((product) => this._indexProduct(new_index, product))
      })
    })
    .catch((err) => console.log("Ups, there's an error!", err))
  }

  ready () { return this.readyProm }

  addListing (listing, keywords) {
    let modelProd = []
    let manufacturerProd = []

    keywords.forEach((keyword) => {
      if (this.indexes["model"][keyword]) {
        modelProd = modelProd.concat(this.indexes["model"][keyword])
      }
      if (this.indexes["manufacturer"][keyword]) {
        manufacturerProd = manufacturerProd.concat(this.indexes["manufacturer"][keyword])
      }
    })

    let prod = _intersect(modelProd, manufacturerProd)[0]
    if (prod) this._addListing(prod, listing)
  }

  map (cb) {
    return this.products.map(cb)
  }

  _addListing (product, listing) { 
    if (!product.listings) product.listings = []
    product.listings.push(listing)
  }
  _indexProduct (index, product) {
    let subIndex = product[index].toLowerCase()
    if (!this.indexes[index][subIndex]) this.indexes[index][subIndex] = []
    this.indexes[index][subIndex].push(product)
  }
  _createIndex (index) { this.indexes[index] = {} }
};
