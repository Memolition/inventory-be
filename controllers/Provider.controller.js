const db = require("../models");
const Provider = db.providers;
const ProviderLines = db.providerLines;
const ProviderBrands = db.providerBrands;
const Op = db.Sequelize.Op;

// Create and Save a new Provider
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    const provider = {
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        account: req.body.account,
    }

    //console.log('req.body', req.body);

    Provider.create(provider)
        .then(data => {
          data.setProviderLines(req?.body?.lines?.map(providerLine => providerLine.id) ?? []);
          data.setProviderBrands(req?.body?.brands?.map(providerBrand => providerBrand.id) ?? []);

          res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Provider."
        });
    });
};

// Retrieve Person by nit from the database.
exports.findAllActive = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Provider.findAll({ where: { deleted: false, ...condition }, include: [{ model: ProviderLines }, { model: ProviderBrands }] })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Providers."
      });
    });  
};

// Find all Providers including deleted
exports.findAll = (req, res) => {
    Provider.findAll()
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

// Find a single Provider with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Provider.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Provider with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Provider with id=" + id
        });
    });
};

// Update a Provider by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Provider.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "Provider was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Provider with id=${id}. Provider couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Provider with id=" + id
      });
    });
};

// Soft delete a Provider by the id in the request
exports.softDelete = (req, res) => {
    const id = req.params.id;
    Provider.update({deleted: true}, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "Provider was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Provider with id=${id}. Provider couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Provider with id=" + id
      });
    });
};

// Delete a Provider with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Provider.destroy({
        where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Provider was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Provider with id=${id}. Maybe Provider was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Provider with id=" + id
      });
    });
};

// Delete all Providers from the database.
exports.deleteAll = (req, res) => {
    Provider.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Providers were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all products."
        });
    });
};
