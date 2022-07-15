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

exports.list = (req, res) => {
  ImportProduct.findAll().then(data => {
    res.send(data);
  });
}

// Create and Save a new Product
exports.last = (req, res) => {
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

// Delete all Products from the database.
exports.delete = (req, res) => {
    ImportProduct.destroy({
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
