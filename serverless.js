const { Component } = require('@serverless/core')
const fs = require('fs')
const http = require('http')
const YAML = require('yamljs')

class TencentPreSCF extends Component {
  async serverlessYaml(yaml) {
    try {
      const yamlContent = fs.readFileSync(yaml, 'utf-8')
      const data = {
        yaml: yamlContent
      }
      const requestData = JSON.stringify(data)
      const options = {
        host: 'service-8d3fi753-1256773370.bj.apigw.tencentcs.com',
        port: '80',
        path: '/release/scf_2_serverless/components/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      let newYamlResponse = await new Promise(function(resolve, reject) {
        const req = http.request(options, function(res) {
          res.setEncoding('utf8')
          res.on('data', function(chunk) {
            resolve(chunk)
          })
        })
        req.on('error', function(e) {
          reject(e.message)
        })
        req.write(requestData)
        req.end()
      })
      newYamlResponse = JSON.parse(newYamlResponse)
      if (newYamlResponse['error']) {
        throw new Error(
          newYamlResponse.result ? newYamlResponse.result : "Couldn't get serverless yaml."
        )
      } else {
        return YAML.parse(newYamlResponse['result'])
      }
    } catch (e) {
      throw e
    }
  }

  async default(inputs = {}) {
    const oldYaml = inputs.yaml
    const region = inputs.region || 'ap-guangzhou'
    if (!oldYaml) {
      throw new Error('Yaml is required!')
    }
    const stateSave = new Array()
    const scfList = new Array()
    const newYamlData = await this.serverlessYaml(oldYaml)
    const componentList = Object.keys(newYamlData)
    for (let i = 0; i < componentList.length; i++) {
      const thisName = componentList[i]
      const tencentSCF = await this.load('@serverless/tencent-scf', thisName)
      newYamlData[thisName]['inputs'].region = region
      const scfOutput = await tencentSCF(newYamlData[thisName]['inputs'])
      scfList.push(scfOutput)
      stateSave.push(thisName)
    }
    this.state.deployed = stateSave
    await this.save()
    return scfList
  }

  async remove(inputs = {}) {
    for (let i = 0; i < this.state.deployed.length; i++) {
      const tencentSCF = await this.load('@serverless/tencent-scf', this.state.deployed[i])
      await tencentSCF.remove()
    }
    return {}
  }
}

module.exports = TencentPreSCF
