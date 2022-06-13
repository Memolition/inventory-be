const { sequelize, Sequelize } = require("../models");
const db = require("../models");
const Provider = db.providers;
const Product = db.products;
const Movement = db.movements;
const Order = db.orders;
const Person = db.people;
const Purchase = db.purchases;
const Op = db.Sequelize.Op;

// Create and Save a new Product
exports.create = (req, res) => {
    // Validate request
    if (!req.body.name) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    
    const product = {
        name: req.body.name,
        barcode: req.body.barcode,
        partNumber: req.body.partNumer,
        ProviderId: req.body.provider,
        buyingPrice: req.body.buyingPrice,
        sellingPrice: req.body.hasSellingPrice ? req.body.sellingPrice : req.body.buyingPrice,
        minimumQuantity: req.body.minimumQuantity,
        stock: req.body.stock ?? 0,
    };

    Product.create(product)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product."
        });
    });
};

exports.import = async (req, res) => {
  // Validate request
  if (!req.body.file) {
      res.status(400).send({
          message: "Content can not be empty!"
      });

      return;
  }
  
  const CreatedProducts = [];
  const UpdatedStock = [];

  for(const row of req.body.file) {
    if(!!row["Nombre de Proveedor"]) {
      const providers = await Provider.findAll({where: { name: row["Nombre de Proveedor"]}});

      let providerId;

      if(!!providers?.length) {
        providerId = providers[0].id;
      } else {
        const newProvider = await Provider.create({
          name: row["Nombre de Proveedor"],
          address: "",
          phone: row["Numero de Proveedor"],
          account: row["No de Cuenta Bancaria Proveedor"],
        });

        providerId = newProvider.id;
      }

      const allProducts = await Product.findAll({
        where: {
          [Op.or]: {
            name: row["Nombre Producto"],
            barcode: {
              [Op.eq]: row["Codigo de Barra"],
              [Op.ne]: null,
              [Op.ne]: '',
            },
            partNumber: {
              [Op.eq]: row["No de Parte"],
              [Op.ne]: null,
              [Op.ne]: '',
            }
          },
        }
      });

      if(!!allProducts?.length) {
        const currentProductStock = allProducts[0];

        const updatedProductStock = await Product.update(
          { stock: parseFloat(currentProductStock.stock) + parseFloat(row["Cantidad"]) },
          {
            where: { id: currentProductStock.id }
          }
        );

        UpdatedStock.push(updatedProductStock);
      } else {
        const productEntity = {
          name: row["Nombre Producto"],
          barcode: row["Codigo de Barra"],
          partNumber: row["No de Parte"],
          ProviderId: providerId,
          buyingPrice: 0,
          sellingPrice: row["Precio actual de Venta"],
          minimumQuantity: 0,
          stock: parseInt(row["Cantidad"]),
        };
  
        const newProduct = await Product.create(productEntity);
        CreatedProducts.push(newProduct);
      }
    }
  };

  res.json({
    CreatedProducts,
    UpdatedStock,
  });
};

// Retrieve all Products from the database.
exports.findAllActive = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAll({ where: { deleted: false, ...condition } })
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
// Retrieve all Products from the database.
exports.findAllMinimum = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAll({ where: { deleted: false, stock: { [Op.gt]: sequelize.col("minimumQuantity") }, ...condition } })
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

// Retrieve all Products from the database.
exports.findAllActive = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

  Product.findAll({ where: { deleted: false, ...condition } })
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
    Product.findAll()
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
    Product.findByPk(id, {include: {model: Movement, include: [{ model: Order, include: { model: Person } }, { model: Purchase }]}})
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
            message: "Error retrieving Product with id=" + id,
            err
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
