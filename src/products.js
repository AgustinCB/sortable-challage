'use strict'

import { default as promisify } from 'promisify-node'
import path from 'path'

let fs;

const PRODUCT_INDEXES = Object.freeze([
  "model",
  "manufacturer"
]);

const _intersectOrFirst = (a, b) => {
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

  addListing (listing) {
    let modelProd = this._searchMatches(listing.title, "model", listing)
    let manufacturerProd = this._searchMatches(listing.manufacturer, "manufacturer", listing, true)

    let prod = this._pickBest(_intersectOrFirst(modelProd, manufacturerProd), this._getKeywords(listing.title))
    if (prod) this._addListing(prod, listing)
  }

  map (cb) {
    return this.products.map(cb)
  }

  _searchMatches(content, index, listing, partial = false) {
    let prods = []
    let keywords = this._getKeywords(content)

    if (!partial) {
      keywords.forEach((keyword, i) => {
        let found = false
        this._makePhrases(keywords, i).forEach((keyword) => {
          if (!found && !partial && this.indexes[index][keyword]) {
            prods = prods.concat(this.indexes[index][keyword])
            found = true
          }
        })
      })
    } else {
      keywords.forEach((keyword, i) => {
        Object.keys(this.indexes[index]).forEach((subIndex) => {
          if (subIndex.indexOf(keyword) > -1) {
            prods = prods.concat(this.indexes[index][subIndex])
          }
        })
      })
    }

    return prods
  }

  _getKeywords (content) { return content.split(" ").map((keyword) => keyword.toLowerCase())  }

  _makePhrases(keywords, i) {
    const makePhrase = (limit) => keywords.slice(i, limit).join(" ")
    return [ keywords[i], makePhrase(i+2), makePhrase(i+3) ].reverse()
  }

  _pickBest(prods, keywords) {
    if (!prods.length) return undefined
    if (prods.length == 1) return prods[0]

    let finalProd = prods.find((prod) => prod.family && keywords.indexOf(prod.family.toLowerCase()) > -1)
    return finalProd ? finalProd : prods[0]
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
