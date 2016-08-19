'use strict'

import { default as promisify } from 'promisify-node'
import path from 'path'

let fs;

export default class Listings {
  constructor () {
    fs = promisify("fs")

    this.readyProm = fs.readFile(path.join(__dirname, '../data/listings.txt'), 'utf8')
    .then((listings_string) => {
      this.listings = listings_string.split("\n").filter((p) => !!p).map(JSON.parse)
    })
    .catch((err) => console.log("Ups, there's an error!", err))
  }

  ready () { return this.readyProm }
};
