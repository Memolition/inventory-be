const { sequelize, Sequelize } = require("../models");
const db = require("../models");
const Provider = db.providers;
const ImportProduct = db.importProducts;
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

const importProduct = async (product) => {
  if(!!product.name) {
    const providers = await Provider.findAll({where: { name: product.providerName}});

    let providerId;

    if(!!providers?.length) {
      providerId = providers[0].id;
    } else {
      const newProvider = await Provider.create({
        name: product.providerName,
        address: "",
        phone: product.providerPhone ?? '',
        account: product.providerAccount ?? '',
      });

      providerId = newProvider.id;
    }

    const rawSellingPrice = parseFloat((product.sellingPrice + "").replace(/[^\d\.]/g, ''));
    const sellingPrice = !isNaN(rawSellingPrice) ? rawSellingPrice : 0;
    const buyingPrice = !isNaN(sellingPrice) && sellingPrice > 0.1 ? sellingPrice - (sellingPrice * 0.3) : 0;

    const allProducts = await Product.findAll({
      where: {
        [Op.or]: {
          barcode: {
            [Op.eq]: product.barcode,
            [Op.ne]: null,
            [Op.ne]: '',
          },
          partNumber: {
            [Op.eq]: product.partNumber,
            [Op.ne]: null,
            [Op.ne]: '',
          }
        },
      }
    });

    const productEntity = {
      name: product.name,
      barcode: '',
      partNumber: product.partNumber,
      ProviderId: providerId,
      buyingPrice,
      sellingPrice,
      minimumQuantity: 0,
      stock: parseInt(product.stock),
    };

    if(!!allProducts?.length) {
      const currentProductStock = allProducts[0];

      await Product.update(
        {
          buyingPrice,
          sellingPrice,
          stock: parseFloat(currentProductStock.stock) + parseFloat(product.stock) },
        {
          where: { id: currentProductStock.id }
        }
      );

      return ['updated', currentProductStock];
    } else if(product.barcode == '' || product.barcode?.length <= 0) {
      const newProduct = await ImportProduct.create({
        ...productEntity,
        providerName: product.providerName,
        providerPhone: product.providerPhone,
        providerAccount: product.providerAccount,
      });
      return ['barcode', newProduct];
    } else {
      productEntity.barcode = product.barcode;

      const newProduct = await Product.create(productEntity);
      return ['created', newProduct];
    }
  }

  return false;
}

exports.import = async (req, res) => {
  // Validate request
  if (!req.body.file && !req.body.products) {
      res.status(400).send({
          message: "Content can not be empty!"
      });

      return;
  }

  await ImportProduct.destroy({
    where: {},
    truncate: false
  });
  
  const CreatedProducts = [];
  const UpdatedStock = [];
  const MissingCodebar = [];
  
  if(!!req?.body?.products?.length) {
    console.log('importing products', req.body.products);
    for(const product of req.body.products) {
      const result = await importProduct(product);

      console.log('producdt not imported', result);
  
      if(!result) {

      } else if(result[0] === 'created') {
        CreatedProducts.push(result[1])
      } else if(result[0] === 'updated') {
        UpdatedStock.push(result[1]);
      } else if(result[0] === "barcode") {
        MissingCodebar.push(result[1]);
      }
    }
  } else {
    for(const row of req.body.file) {
      const result = await importProduct({
        name: row["Nombre Producto"],
        barcode: row["Codigo de Barra"],
        partNumber: row["No de Parte"],
        providerName: row["Nombre de Proveedor"],
        providerPhone: row["Numero de Proveedor"],
        providerAccount: row["No de Cuenta Bancaria Proveedor"],
        sellingPrice: row["Precio actual de Venta"],
        stock: row["Cantidad"],
      });
  
      if(result[0] === 'created') {
        CreatedProducts.push(result[1])
      } else if(result[0] === 'updated') {
        UpdatedStock.push(result[1]);
      } else if(result[0] === "barcode") {
        MissingCodebar.push(result[1]);
      }
    }
  }

  res.json({
    CreatedProducts,
    UpdatedStock,
    MissingCodebar,
  });
};

exports.updateImport = (req, res) => {
  const id = req.params.id;
  ImportProduct.update(req.body, {
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
    sequelize.query('select * from Products where stock < Products.minimumQuantity')
    .then(data => {
      res.send(!!data?.length ? data[0] : []);
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
