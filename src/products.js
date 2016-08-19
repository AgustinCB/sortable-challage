'use strict'

import { default as promisify } from 'promisify-node'
import path from 'path'

let fs;

const PRODUCT_INDEXES = Object.freeze([
  "model"
]);

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
    keywords.forEach((keyword) => {
      if (this.indexes["model"][keyword]) {
        this._addListing(this.indexes["model"][keyword], listing)
      }
    })
  }

  map (cb) {
    return this.products.map(cb)
  }

  _addListing (product, listing) { 
    if (!product.listings) product.listings = []
    product.listings.push(listing)
  }
  _indexProduct (index, product) { this.indexes[index][product[index]] = product }
  _createIndex (index) { this.indexes[index] = {} }
};
