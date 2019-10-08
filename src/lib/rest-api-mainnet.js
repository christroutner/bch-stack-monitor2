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
const bitbox = new BITBOX({ restURL: `http://${config.serverIP}:13500/v2/` })

const SLPSDK = require('slp-sdk')
const slpsdk = new SLPSDK({ restURL: `http://${config.serverIP}:13500/v2/` })

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
      // testnet token ID SIM1
      const tokenId = `46c437cb9675af9b84cf08d0cfb6d9c97c2a77fb08bda78d54a447a7edda2b58`

      const result = await slpsdk.Utils.list(tokenId)

      await utils.logAll(`SLP: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`SLP: PASSED`)
      this.localLog(
        `testSLP for tokenId ${tokenId}: ${JSON.stringify(result, null, 2)}`
      )
    } catch (err) {
      await utils.logAll(`SLP: FAILED`)

      console.error(`Error in rest-api-mainnet.js/testSLP(): `, err)
      this.localLog(`Error in rest-api-mainnet.js/testSLP(): ${err.message}`)
    }
  }

  async testFullNode () {
    try {
      // console.log(`bitbox: ${util.inspect(bitbox)}`);

      const result = await bitbox.Control.getNetworkInfo()
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

      const addr = 'bchtest:qpenrdn5mtxcpanpcvwpzqv70uar6r87rudyhpud0w'
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
