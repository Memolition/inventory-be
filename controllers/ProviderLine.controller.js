const db = require("../models");
const ProviderLine = db.providerLines;
const Op = db.Sequelize.Op;

// Create and Save a new ProviderLine
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    const line = {
        name: req.body.name,
    }

    ProviderLine.create(line)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the ProviderLine."
        });
    });
};

// Retrieve all ProviderLines from the database.
exports.suggest = (req, res) => {
    const {fieldVal} = req.params;

    ProviderLine.findAll({
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
          err.message || "Some error occurred while retrieving ProviderLines."
      });
    });  
};

// Retrieve Person by nit from the database.
exports.findAllActive = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    ProviderLine.findAll({ where: { deleted: false, ...condition } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProviderLines."
      });
    });  
};

// Find all ProviderLines including deleted
exports.findAll = (req, res) => {
    ProviderLine.findAll()
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

// Find a single ProviderLine with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    ProviderLine.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find ProviderLine with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving ProviderLine with id=" + id
        });
    });
};

// Update a ProviderLine by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    ProviderLine.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "ProviderLine was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update ProviderLine with id=${id}. ProviderLine couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ProviderLine with id=" + id
      });
    });
};

// Soft delete a ProviderLine by the id in the request
exports.softDelete = (req, res) => {
    const id = req.params.id;
    ProviderLine.update({deleted: true}, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "ProviderLine was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update ProviderLine with id=${id}. ProviderLine couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ProviderLine with id=" + id
      });
    });
};

// Delete a ProviderLine with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    ProviderLine.destroy({
        where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProviderLine was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete ProviderLine with id=${id}. Maybe ProviderLine was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete ProviderLine with id=" + id
      });
    });
};

// Delete all ProviderLines from the database.
exports.deleteAll = (req, res) => {
    ProviderLine.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} ProviderLines were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all products."
        });
    });
};
