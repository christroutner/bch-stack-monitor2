
/*
  This is an automated test system that periodically run integration tests to
  ensure that bch-api is running and the stack of software in encapsulates
  is fully functional.
*/

'use strict'

const PERIOD = 60000 * 60 * 1 // 1 hr
// const PERIOD = 60000 * 60

const GARBAGE_PERIOD = 60000 * 60 * 24 // 1 day
// const GARBAGE_PERIOD = 60000 * 60 * 4 // 4 hours

const utils = require('./lib/util')

const BCHAPI = require('./lib/bch-api-mainnet')
const bchapi = new BCHAPI()

const REST = require('./lib/rest-api-mainnet')
const rest = new REST()

const TimeLanguage = 'en-US'
const TimeZone = 'America/Los_Angeles'

// Used for debugging and iterrogating JS objects.
const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

// Have the BVT run all tests.
async function runTests () {
  try {
    // Cleanup old data and prepare for a new run of tests.
    utils.clearUutDir()
    utils.clearLogs()
    utils.log(`Prepared bch-stack-monitor for new run.`)

    // Initialize the logs.
    const startTime = new Date()
    await utils.logAll(`bch-stack-monitor tests started at ${startTime.toLocaleString(TimeLanguage, { timeZone: TimeZone })}`)

    await utils.logAll(`bch-api tests:`)
    await bchapi.runTests()

    await utils.logAll(` `)

    await utils.logAll(`rest.bitcoin.com tests:`)
    await rest.runTests()

    // Signal the tests have completed.
    const endTime = new Date()
    await utils.logAll(`bch-stack-monitor tests completed at ${endTime.toLocaleString(TimeLanguage, { timeZone: TimeZone })}`)

    // Signal when the next run will be
    const nextRun = new Date(startTime.getTime() + PERIOD)
    await utils.logAll(`Next bch-stack-monitor run will be at ${nextRun.toLocaleString(TimeLanguage, { timeZone: TimeZone })}.`)
  } catch (err) {
    console.error(`Error in runTests(): `, err)
    utils.log(`Error running BVT: ${err.message}`)
  }
}

function startTests () {
  // Run the tests immediately
  runTests()

  // Periodically run the BVT
  setInterval(function () {
    runTests()
  }, PERIOD)

  // Run garbage collection once per day, to delete any old logs.
  setInterval(function () {
    utils.collectGarbage()
  }, GARBAGE_PERIOD)
}

module.exports = startTests
