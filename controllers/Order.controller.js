const { productStock } = require("../models");
const db = require("../models");
const Person = db.people;
const Product = db.products;
const ProductStock = db.productStock;
const Order = db.orders;
const Movement = db.movements;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = (req, res) => {
    Order.create({
      PersonId: req?.body?.customer ?? null,
      invoice: req?.body?.invoice,
      series: req?.body?.invoiceSeries,
    })
      .then(data => {
        return Promise.all(req.body.products.map(async (orderProduct) => {
          const currentPriceQuery = await Product.findByPk(orderProduct.product);
          const currentPrice = currentPriceQuery?.sellingPrice ?? 0;

          await Movement.create({
            OrderId: data.id,
            ProductId: orderProduct.product,
            quantity: orderProduct.quantity,
            price: currentPrice,
          });

          const currentProductStock = await Product.findOne({where: {id: orderProduct.product}});
          if(!!currentProductStock) {
            await Product.update(
              { stock: parseFloat(currentProductStock.stock) - parseFloat(orderProduct.quantity) },
              {
                where: { id: orderProduct.product }
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
  Order.findAll({
    where: {
      deleted: false,
      createdAt: { 
        [Op.gt]: `${req.query.start} 00:00:00`,
        [Op.lt]: `${req.query.end} 23:59:59`,
      }
    },
    include: [{model: Movement, include: Product}, {model: Person},], order: [['id', 'DESC']]
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
    Order.findAll()
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

// Find all Products including deleted
exports.findByInvoice = (req, res) => {
  const invoiceCondition = req?.query?.invoice ? { invoice: { [Op.like]: `%${req?.query?.invoice}%` } } : null;

  Order.findAll({ where: { deleted: false, ...invoiceCondition } })
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
exports.findBySeries = (req, res) => {
  const seriesCondition = req?.query?.series ? { series: { [Op.like]: `%${req?.query?.series}%` } } : null;

  Order.findAll({ where: { deleted: false, ...seriesCondition } })
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
    Order.findByPk(id)
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
    Order.update(req.body, {
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
    Order.update({deleted: true}, {
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
    Order.destroy({
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
    Order.destroy({
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
