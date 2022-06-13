const db = require("../models");
const Expense = db.expenses ;
const Op = db.Sequelize.Op;

// Create and Save a new Expense
exports.create = (req, res) => {
    // Validate request
    if (!req.body.note || !req.body.amount) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    Expense.create({
      note: req?.body?.note,
      amount: req?.body?.amount,
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Expense."
        });
    });
};

// Retrieve all Expenses from the database.
exports.findAllActive = (req, res) => {
    Expense.findAll({ where: { deleted: false, createdAt: { 
      [Op.gt]: `${req.query.start} 00:00:00`,
      [Op.lt]: `${req.query.end} 23:59:59`,
    } } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Expenses."
      });
    });  
};

// Find all Expenses including deleted
exports.findAll = (req, res) => {
    Expense.findAll()
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

// Find a single Expense with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Expense.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Expense with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Expense with id=" + id
        });
    });
};

// Update a Expense by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Expense.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "Expense was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Expense with id=${id}. Expense couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Expense with id=" + id
      });
    });
};

// Soft delete a Expense by the id in the request
exports.softDelete = (req, res) => {
    const id = req.params.id;
    Expense.update({deleted: true}, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "Expense was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Expense with id=${id}. Expense couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Expense with id=" + id
      });
    });
};

// Delete a Expense with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Expense.destroy({
        where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Expense was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Expense with id=${id}. Maybe Expense was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Expense with id=" + id
      });
    });
};

// Delete all Expenses from the database.
exports.deleteAll = (req, res) => {
    Expense.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Expenses were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all products."
        });
    });
};
