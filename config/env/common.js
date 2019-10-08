/*
  This file is used to store unsecure, application-specific data common to all
  environments.
*/

module.exports = {
  port: process.env.PORT || 12401,
  // serverIP: `192.168.0.36`
  serverIP: `172.17.0.1`
}
