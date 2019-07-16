/*
  A class that tests a live version of rest.bitcoin.com to verify it is
  correctly connected to all infrastructure lower down in the stack.

  This library focuses on testing MAINNET
*/

'use strict'

const shell = require('shelljs')
const utils = require('./util')
const config = require('../../config')

// Assumes mainnet
const BITBOX = require('bitbox-sdk').BITBOX
const bitbox = new BITBOX({ restURL: `http://${config.serverIP}:12500/v2/` })

const SLPSDK = require('slp-sdk')
const slpsdk = new SLPSDK({ restURL: `http://${config.serverIP}:12500/v2/` })

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

class Tests {
  // constructor () {}

  // Parent function called by the BVT.
  async runTests () {
    await this.testFullNode()
    await this.testInsight()
    await this.testSLP()

    utils.log(`rest.bicoin.com tests complete.`)
    utils.log(` `)
  }

  // Log text to the logs for this test suite.
  localLog (str) {
    try {
      shell.cd(`${__dirname}`)
      shell.exec(
        `echo "${str}" >> ${__dirname}/../../html/logs/rest/mainnet.txt`
      )
    } catch (err) {
      console.log(`Error in rest-api-mainnet.js/localLog(): `)
      throw err
    }
  }

  async testSLP () {
    try {
      // Spice token ID.
      const tokenId = `4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf`

      await slpsdk.Utils.list(tokenId)

      await utils.logAll(`SLP: PASSED`)
    } catch (err) {
      await utils.logAll(`SLP: FAILED`)

      console.error(`Error in rest-api-mainnet.js/testSLP(): `, err)
      this.localLog(`Error in rest-api-mainnet.js/testSLP(): ${err.message}`)
    }
  }

  async testFullNode () {
    try {
      // console.log(`bitbox: ${util.inspect(bitbox)}`);

      const result = await bitbox.Control.getInfo()
      // console.log(`getInfo: ${JSON.stringify(result, null, 2)}`);

      await utils.logAll(`Full node: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`Full node: PASSED`)
      this.localLog(`full node version: ${result.version}`)
    } catch (err) {
      await utils.logAll(`Full node: FAILED`)

      console.error(`Error in rest-api-mainnet.js/testFullNode(): `, err)
      this.localLog(
        `Error in rest-api-mainnet.js/testFullNode(): ${err.message}`
      )
    }
  }

  async testInsight () {
    try {
      // console.log(`bitbox: ${util.inspect(bitbox)}`)

      const addr = 'bitcoincash:qz9dsscynjr5r33c5al9yd7rn842u8qaxyn3chpt0c'
      const result = await bitbox.Address.details(addr)

      await utils.logAll(`Insight: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`Insight: PASSED`)
      this.localLog(
        `testInsight for address ${addr}: ${JSON.stringify(result, null, 2)}`
      )
    } catch (err) {
      await utils.logAll(`Insight: FAILED`)

      console.log(`Error in rest-api-mainnet.js/testInsight(): `, err)
      this.localLog(
        `Error in rest-api-mainnet.js/testInsight(): ${err.message}`
      )
    }
  }
}

module.exports = Tests
