'use strict'

import { default as promisify } from 'promisify-node'
import path from 'path'
import Products from './products'
import Listings from './listings'

let fs = promisify("fs")

const getKeywords = (title) => title.split(" ")
const createResult = (product) => ({
  product_name: product.product_name,
  listings: product.listings
});

const main = () => {
  let products = new Products()
  let listings = new Listings()

  return Promise.all([products.ready(), listings.ready()])
  .then(() => {
    for (let listing of listings.listings) {
      products.addListing(listing, getKeywords(listing.title))
    }

    fs.writeFile(path.join(__dirname, '../data/results.txt'),
      products.map(createResult).map(JSON.stringify).join("\n"), 'utf8')
  })
}

if (require.main === module) {
  main()
  .then(() => console.log("File created at ./data/results.txt"))
  .catch((err) => console.log("Ups, there's an error!", err))
}
