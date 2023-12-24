const cp = require('child_process')

const exec = async (command) => {
  console.log(`exec: ${command}`, '--------------------')
  return new Promise((resolve, reject) => {
    cp.exec(command, (error, stdout) => {
      if (error) return reject(error)
      resolve(stdout)
    })
  })
}

module.exports = { exec }
