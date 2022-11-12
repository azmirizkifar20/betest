'use strict';

const db = require('../models')
const Response = require('../utils/response')

class UserController {

    constructor() {
        // models
        this.user = db.user
    }

    /* 
        ===========================================================================================
        request raw data contains : 
        userName, accountNumber, emailAddress, identityNumber
        ===========================================================================================
    */
    create = async(req, res) => {
        try {
            // get raw data
            const { 
                userName, 
                accountNumber, 
                emailAddress, 
                identityNumber
            } = req.body

            // create user
            const user = await this.user.create({
                userName, 
                accountNumber, 
                emailAddress, 
                identityNumber
            })

            return Response.send(res, 201, user, 'Successfully create user!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }

    get = async(req, res) => {
        try {
            // get user
            const user = await this.user.find()

            return Response.send(res, 200, user, 'Successfully get users!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }

    /* 
        ===========================================================================================
        request path params contains : 
        id
        ===========================================================================================
    */
    getSingle = async(req, res) => {
        try {
            // get user
            const user = await this.user.findById(req.params.id)

            if (!user)
                return Response.send(res, 404, null, 'User not found!')

            return Response.send(res, 200, user, 'Successfully get single user!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }
    
    /* 
        ===========================================================================================
        request path params contains : 
        key_name, key_value
        ===========================================================================================
    */
    getSingleByKey = async(req, res) => {
        try {
            let find = null

            // check key_name
            if (req.params.key_name == 'account-number')
                find = { accountNumber: req.params.key_value }
            else if (req.params.key_name == 'identity-number')
                find = { identityNumber: req.params.key_value }
            
            if (find == null)
                return Response.send(res, 400, null, 'Key name is not recognized!')

            // get user
            const user = await this.user.find(find)

            if (user.length == 0)
                return Response.send(res, 404, null, 'User not found!')

            return Response.send(res, 200, user[0], 'Successfully get single user!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }

    /* 
        ===========================================================================================
        request path params contains : 
        id

        request raw data contains (all optional) : 
        userName, accountNumber, emailAddress, identityNumber
        ===========================================================================================
    */
    update = async(req, res) => {
        try {
            // get user
            const user = await this.user.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            })

            if (!user)
                return Response.send(res, 404, null, 'User not found!')

            return Response.send(res, 200, user, 'Successfully update user!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }
    
    /* 
        ===========================================================================================
        request path params contains : 
        id
        ===========================================================================================
    */
    delete = async(req, res) => {
        try {
            // get user
            const user = await this.user.findById(req.params.id)

            if (!user)
                return Response.send(res, 404, null, 'User not found!')

            // delete user
            user.remove()

            return Response.send(res, 200, null, 'Successfully delete user!')
        } catch (err) {
            return Response.send(res, 500, null, "Internal Server Error", err.message)
        }
    }
}

module.exports = new UserController()