const yup = require('yup');
const express = require('express');
const router = express.Router();
const { Product, Category, Supplier } = require('../models');
const ObjectId = require('mongodb').ObjectId;

const {
  validateSchema,
  getProductsSchema,
} = require('../validation/product');

// Methods: POST / PATCH / GET / DELETE / PUT

// ------------------------------------------------------------------------------------------------
// Get all
router.get('/', validateSchema(getProductsSchema), async (req, res, next) => {
  try {
    const {
      category,
      supplier,
      q,
      skip,
      limit,
      productName,
      stockStart,
      stockEnd,
      priceStart,
      priceEnd,
      discountStart,
      discountEnd,
    } = req.query;
    const conditionFind = {};

    if (category) conditionFind.categoryId = category;
    if (supplier) conditionFind.supplierId = supplier;
    if (productName) {
      conditionFind.name = new RegExp(`${productName}`)
    }

    if (stockStart & stockEnd) {
      conditionFind.stock = {
        $expr: {
          $and: [
            { stock: { $gte: Number(stockStart) } },
            { stock: { $lte: Number(stockEnd) } },
          ]
        }
      }
    } else if (stockStart) {
      conditionFind.stock = {
        $expr: {
          $and: [
            { stock: { $gte: Number(stockStart) } },
          ]
        }
      }
    } else if (stockEnd) {
      conditionFind.stock = {
        $expr: {
          $and: [
            { stock: { $lte: Number(stockEnd) } },
          ]
        }
      }
    }

    console.log('««««« conditionFind »»»»»', conditionFind);

    let results = await Product
      .find(conditionFind)
      .populate('category')
      .populate('supplier')
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true });

    const countAllProduct = await Product.count();
    res.json({ total: countAllProduct, data: results });

  } catch (error) {
    console.log('««««« error »»»»»', error);
    res.status(500).json({ ok: false, error });
  }
});




// Get by id
router.get('/:id', async (req, res, next) => {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });


  validationSchema.validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      const { id } = req.params;
      console.log('««««« id »»»»»', id);

      let results = await Product.findById(id).populate('category').populate('supplier').lean({ virtuals: true });

      if (results) {
        return res.send({ ok: true, result: results });
      }

      return res.send({ ok: false, message: 'Object not found' });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

// ------------------------------------------------------------------------------------------------
// Create new data
router.post('/', function (req, res, next) {
  // Validate
  const validationSchema = yup.object({
    body: yup.object({
      name: yup.string().required(),
      price: yup.number().positive().required(),
      discount: yup.number().positive().max(50).required(),
      categoryId: yup
        .string()
        .required()
        .test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
          return ObjectId.isValid(value);
        }),
      supplierId: yup
        .string()
        .required()
        .test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
          return ObjectId.isValid(value);
        }),
    }),
  });

  validationSchema
    .validate({ body: req.body }, { abortEarly: false })
    .then(async () => {
      const data = req.body;

      // let category = await Category.findOne({ _id: data.categoryId });
      // if (!category) return res.status(404).json({ message: 'Not found' });

      // let supplier = await Supplier.findOne({ _id: data.supplierId });
      // if (!supplier) return res.status(404).json({ message: 'Not found' });

      let newItem = new Product(data);
      await newItem.save();
      res.send({ ok: true, message: 'Created', result: newItem });
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});
// ------------------------------------------------------------------------------------------------
// Delete data
router.delete('/:id', function (req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(async () => {
      try {
        const id = req.params.id;

        let found = await Product.findByIdAndDelete(id);

        if (found) {
          return res.send({ ok: true, result: found });
        }

        return res.status(410).send({ ok: false, message: 'Object not found' });
      } catch (err) {
        return res.status(500).json({ error: err });
      }
    })
    .catch((err) => {
      return res.status(400).json({ type: err.name, errors: err.errors, message: err.message, provider: 'yup' });
    });
});

router.patch('/:id', async function (req, res, next) {
  try {
    const id = req.params.id;
    const data = req.body;
    await Product.findByIdAndUpdate(id, data);
    res.send({ ok: true, message: 'Updated' });
  } catch (error) {
    res.status(500).send({ ok: false, error });
  }
});

module.exports = router;