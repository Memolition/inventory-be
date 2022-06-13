const crypto = require('crypto');
const db = require("../models");
const User = db.users;
const Roles = db.userRoles;
const Permissions = db.rolePermissions;

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name || !req.body.password) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const salt = crypto.randomBytes(16).toString('hex');

    User.create({
      name: req?.body?.name,
      salt,
      hash: crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`),
      UserRoleId: req.body.role,
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAllActive = (req, res) => {
    User.findAll({ where: { deleted: false }})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Users."
      });
    });  
};

// Find all Users including deleted
exports.findAll = (req, res) => {
    User.findAll()
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

// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving User with id=" + id
        });
    });
};

// Find a single User with a username and login
exports.login = (req, res) => {
    const username = req.body.name;
    const password = req.body.password;
    
    User.findOne({ where: { name: username }, include: { model: Roles, include: { model: Permissions } } })
    .then(data => {
        if (!!data && data.name && !!data.hash && !!data.salt) {
          const hash = crypto.pbkdf2Sync(password, data.salt, 1000, 64, `sha512`).toString(`hex`);
          if(hash === data.hash) {
            res.send(data);
          } else {
            res.status(401).send({
              message: `Cannot authenticate User with name=${username}.`
            });
          }
        } else {
          res.status(404).send({
            message: `Cannot find User with name=${username}.`
          });
        }

        return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with name=" + username,
        err
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "User was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update User with id=${id}. User couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Soft delete a User by the id in the request
exports.softDelete = (req, res) => {
    const id = req.params.id;
    User.update({deleted: true}, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "User was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update User with id=${id}. User couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + id
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    User.destroy({
        where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all products."
        });
    });
};
