'use strict'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class Helpers {
  generateRandomNumber = (length) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  hashPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  isPasswordValid = async(clientPassword, serverPassword) => {
    const isValid = await bcrypt.compare(clientPassword, serverPassword)
    return isValid
  }

  createJwtToken = async(data, secretKey, expiresIn) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            data,
            secretKey,
            {
                algorithm: 'HS512',
                expiresIn
            },
            (err, token) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ accessToken: token, account: data })
                }
            }
        )
    })
}

  validateData = (data, parentKey, requiredKeys) => {
    if (!Array.isArray(data))
      return {
        valid: false,
        message: `${parentKey} harus berupa array of JSON!`,
      }

    for (const [index, item] of data.entries()) {
      for (const key of requiredKeys) {
        if (item[key] === undefined || item[key] === null) {
          return {
            valid: false,
            message: `Key '${key}' di ${parentKey} pada data ke-${index+1} harus diisi.`,
          }
        }
      }
    }

    return { valid: true }
  }

  validateDataArrayObj = (data, parentKey, requiredKeys) => {
    if (!Array.isArray(data))
      return {
        valid: false,
        message: `${parentKey} harus berupa array of object!`,
      }

    for (const [index, item] of data.entries()) {
      for (const key of requiredKeys) {
        if (item[key] === undefined || item[key] === null) {
          return {
            valid: false,
            message: `data ke-${index+1} di ${parentKey} harus diisi.`,
          }
        }
      }
    }

    return { valid: true }
  }
}

module.exports = new Helpers()