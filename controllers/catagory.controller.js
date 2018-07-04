// Accessing the Service the we just created

var CatagoryService = require('../services/catagory.service');
var ProductService = require('../services/product.service');

// saving the context of this module inside _the variable

_this = this;

exports.checkCatagoryName = async function (req, res, next) {
    if(!req.params.name) {
        return res.status(400).json({status: 400, message: "Catagory name not provided"});
    }

    var catagoryName = req.params.name;
    try {
        var catagory = await CatagoryService.findUserByName(catagoryName);
        if(catagory) {
            res.status(200).json({status: 200, success: false, message: "Catagory name is already taken"});
        } else {
            res.status(200).json({status: 200, success: true, message: "Catagory name is available"});
        }
    } catch (error) {
        res.status(400).json({status: 500, message: error.message});
    }
}


exports.getCatagories = async function(req, res, next) {
    try {
        const catagories = await CatagoryService.getCatagories(req.query.query, req.query.page, req.query.limit, req.query.sort);
        res.status(200).json({status: 200, data: catagories, message: "Successfully get list catagory!"});
    } catch (error) {
        res.status(500).json({status: 500, message: error.message});
    }
}

exports.createCatagory = async function(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({status: 400, message: "You must provide a catagory's name"});
    }
    if (!req.body.parentid) {
        return res.status(400).json({status: 400, message: "You must provide a parent id of catagory"});
    }
    var catagory = {
        name: req.body.name,
        parentid: req.body.parentid
    }
    try {
        var createdCatagory = await CatagoryService.createCatagory(catagory);
        res.status(201).json({status: 201, data: createdCatagory, message: "Successfully created catagory!"});
    } catch (error) {
        res.status(500).json({status: 500, message: error.message});
    }
}

exports.updateCatagory = async function(req, res, next) {
    if (!req.body.name && !req.body.parentid) {
        return res.status(400).json({status: 400, message: "No field is provided"});
    }
    var catagory = {
        _id: req.body._id,
        name: req.body.name ? req.body.name : null,
        parentid: req.body.parentid ? req.body.parentid : null
    }
    try {
        var updatedCatagory = await CatagoryService.updateCatagory(catagory);
        res.status(201).json({status: 201, data: updatedCatagory, message: "Successfully updated catagory!"});
    } catch (error) {
        res.status(500).json({status: 500, message: error.message});
    }
}

exports.deleteCatagory = async function(req, res, next) {
    if (!req.params.id) {
        return res.status(400).json({status: 400, message: "Catagory id must be present"});
    }
    try {
        const listProduct = await ProductService.getProducts({catagoryid: req.params.id});
        console.log(listProduct);
        // await CatagoryService.deleteCatagory(req.params.id);
        return res.status(200).json({status: 200, message: "The catagory is deleted!"});
    } catch (error) {
        res.status(500).json({status: 500, message: error.message});
    }
}