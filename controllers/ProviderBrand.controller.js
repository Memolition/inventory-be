const db = require("../models");
const ProviderBrand = db.providerBrands;
const Op = db.Sequelize.Op;

// Create and Save a new ProviderBrand
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    const brand = {
        name: req.body.name,
    }

    ProviderBrand.create(brand)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the ProviderBrand."
        });
    });
};

// Retrieve all ProviderBrands from the database.
exports.suggest = (req, res) => {
    const {fieldVal} = req.params;

    ProviderBrand.findAll({
      where: {
        deleted: false,
        tax_id: {
          [Op.like]: `%${fieldVal}%`
        },
        name: {
          [Op.like]: `%${fieldVal}%`
        },
      }
    })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProviderBrands."
      });
    });  
};

// Retrieve Person by nit from the database.
exports.findAllActive = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    ProviderBrand.findAll({ where: { deleted: false, ...condition } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProviderBrands."
      });
    });  
};

// Find all ProviderBrands including deleted
exports.findAll = (req, res) => {
    ProviderBrand.findAll()
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving products."
        });
      });
};

// Find a single ProviderBrand with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    ProviderBrand.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find ProviderBrand with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving ProviderBrand with id=" + id
        });
    });
};

// Update a ProviderBrand by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    ProviderBrand.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "ProviderBrand was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update ProviderBrand with id=${id}. ProviderBrand couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ProviderBrand with id=" + id
      });
    });
};

// Soft delete a ProviderBrand by the id in the request
exports.softDelete = (req, res) => {
    const id = req.params.id;
    ProviderBrand.update({deleted: true}, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "ProviderBrand was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update ProviderBrand with id=${id}. ProviderBrand couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ProviderBrand with id=" + id
      });
    });
};

// Delete a ProviderBrand with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    ProviderBrand.destroy({
        where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProviderBrand was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete ProviderBrand with id=${id}. Maybe ProviderBrand was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete ProviderBrand with id=" + id
      });
    });
};

// Delete all ProviderBrands from the database.
exports.deleteAll = (req, res) => {
    ProviderBrand.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} ProviderBrands were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all products."
        });
    });
};
