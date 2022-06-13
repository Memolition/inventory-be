const db = require("../models");
const Purchase = db.purchases;
const Movement = db.movements;
const Provider = db.providers;
const Product = db.products;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = (req, res) => {
  console.log('Request Body', req.body);
  //return res.status(200);

    // Validate request
    Purchase.create({
      authroized: true,
      ProviderId: req?.body?.provider
    })
        .then(data => {
          return Promise.all(req.body.products.map(async (orderProduct) => {
            const sellingPrice = parseFloat(orderProduct.sellingPrice ?? 0);
            const unitPrice = sellingPrice > 0 ? sellingPrice / orderProduct.quantity : 0;

            await Movement.create({
              PurchaseId: data.id,
              ProductId: orderProduct.product.id,
              quantity: orderProduct.quantity,
              price: unitPrice,
              load: true,
            });

            const currentProductStock = await Product.findByPk(orderProduct.product.id);
            if(!!currentProductStock) {
              await Product.update(
                { stock: parseFloat(currentProductStock.stock) + parseFloat(orderProduct.quantity) },
                {
                  where: { id: orderProduct.product.id }
                }
              );
            }
          }));
        }).then(data => {
          res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product."
        });
    });
};

// Retrieve all Products from the database.
exports.findAllActive = (req, res) => {
  Purchase.findAll({
    where: {
      deleted: false,
      createdAt: { 
        [Op.gt]: `${req.query.start} 00:00:00`,
        [Op.lt]: `${req.query.end} 23:59:59`,
      },
    },
    include: [
      { model: Provider },
      { model: Movement, include: { model: Product } }
    ],
    order: [['id', 'DESC']]
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Products."
    });
  });  
};

// Find all Products including deleted
exports.findAll = (req, res) => {
  Purchase.findAll({})
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

// Find a single Product with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Purchase.findByPk(id)
    .then(data => {
        if (data) {
            res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find Product with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving Product with id=" + id
        });
    });
};

// Update a Product by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Product.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "Product was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Product with id=${id}. Product couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};

// Soft delete a Product by the id in the request
exports.softDelete = (req, res) => {
    const id = req.params.id;
    Product.update({deleted: true}, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
              message: "Product was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Product with id=${id}. Product couldn't be found or req.body was empty!`
            });
        }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Product with id=" + id
      });
    });
};

// Delete a Product with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Product.destroy({
        where: { id: id }
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Product was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Product with id=" + id
      });
    });
};

// Delete all Products from the database.
exports.deleteAll = (req, res) => {
    Product.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({ message: `${nums} Products were deleted successfully!` });
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while removing all products."
        });
    });
};
