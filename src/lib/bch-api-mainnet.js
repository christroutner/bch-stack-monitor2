/*
  A class that tests a live version of bch-api to verify it is correctly
  connected to all infrastructure lower down in the stack.

  This library focuses on testing MAINNET
*/

'use strict'

const shell = require('shelljs')
const utils = require('./util')
const config = require('../../config')

// Assumes mainnet
const BCHJS = require('@chris.troutner/bch-js')
const bchjs = new BCHJS({ restURL: `http://${config.serverIP}:13400/v3/` })

class Tests {
  // constructor () {}

  // Parent function called by the BVT.
  async runTests () {
    await this.testFullNode()
    await this.testBlockbook()
    await this.testBitcore()
    await this.testInsight()
    await this.testSLP()

    utils.log(`bch-api tests complete.`)
    utils.log(` `)
  }

  // Log text to the logs for this test suite.
  localLog (str) {
    try {
      shell.cd(`${__dirname}`)
      shell.exec(
        `echo "${str}" >> ${__dirname}/../../html/logs/bch-api/mainnet.txt`
      )
    } catch (err) {
      console.log(`Error in bch-api-mainnet.js/localLog(): `)
      throw err
    }
  }

  async testSLP () {
    try {
      // testnet token ID SIM1
      const tokenId = `46c437cb9675af9b84cf08d0cfb6d9c97c2a77fb08bda78d54a447a7edda2b58`

      const result = await bchjs.SLP.Utils.list(tokenId)

      await utils.logAll(`SLP: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`SLP: PASSED`)
      this.localLog(
        `testSLP for tokenId ${tokenId}: ${JSON.stringify(result, null, 2)}`
      )
    } catch (err) {
      await utils.logAll(`SLP: FAILED`)

      this.localLog(`Error in bch-api-mainnet.js/testSLP(): ${err.message}`)
    }
  }

  async testFullNode () {
    try {
      const result = await bchjs.Control.getNetworkInfo()
      // console.log(`getNetworkInfo: ${JSON.stringify(result, null, 2)}`);

      await utils.logAll(`Full node: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`Full node: PASSED`)
      this.localLog(`full node version: ${result.version}`)
    } catch (err) {
      await utils.logAll(`Full node: FAILED`)

      this.localLog(
        `Error in bch-api-mainnet.js/testFullNode(): ${err.message}`
      )
    }
  }

  // Test the Blockbook endpoints.
  async testBlockbook () {
    try {
      const addr = 'bchtest:qpenrdn5mtxcpanpcvwpzqv70uar6r87rudyhpud0w'
      const result = await bchjs.Blockbook.balance(addr)

      await utils.logAll(`Blockbook: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`Blockbook: PASSED`)
      this.localLog(
        `testBlockbook for address ${addr}: ${JSON.stringify(result, null, 2)}`
      )
    } catch (err) {
      await utils.logAll(`Blockbook: FAILED`)

      this.localLog(
        `Error in bch-api-mainnet.js/testBlockbook(): ${err.message}`
      )
    }
  }

  async testBitcore () {
    try {
      const addr = 'bchtest:qpenrdn5mtxcpanpcvwpzqv70uar6r87rudyhpud0w'
      const result = await bchjs.Bitcore.balance(addr)

      await utils.logAll(`Bitore: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`Bitore: PASSED`)
      this.localLog(
        `testBitcore for address ${addr}: ${JSON.stringify(result, null, 2)}`
      )
    } catch (err) {
      await utils.logAll(`Bitcore: FAILED`)

      this.localLog(`Error in bch-api-mainnet.js/testBitcore(): ${err.message}`)
    }
  }

  async testInsight () {
    try {
      const addr = 'bchtest:qpenrdn5mtxcpanpcvwpzqv70uar6r87rudyhpud0w'
      const result = await bchjs.Insight.Address.details(addr)

      await utils.logAll(`Insight: PASSED`)

      // Log the result.
      this.localLog(` `)
      this.localLog(`Insight: PASSED`)
      this.localLog(
        `testInsight for address ${addr}: ${JSON.stringify(result, null, 2)}`
      )
    } catch (err) {
      await utils.logAll(`Insight: FAILED`)

      this.localLog(`Error in bch-api-mainnet.js/testInsight(): ${err.message}`)
    }
  }
}

module.exports = Tests
