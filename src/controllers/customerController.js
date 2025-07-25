const Customers = require('../models/Customers');

const getGenderDistribution = async (req, res) => {
  try {
    const genderData = await Customers.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          gender: '$_id',
          count: 1
        }
      }
    ]);
    res.status(200).json({
        message: 'Data successfully fetched',
        status: 200,
        data: genderData
    });
  } catch (err) {
    console.error('Error fetching gender distribution:', err);
    res.status(500).json({ message: 'Internal server error' })
  }
};

const getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const paginate = req.query.paginate === 'true';

  try {
    let query = Customers.find({});
    if (paginate) {
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }

    const customers = await query.exec();
    let totalCustomers = null;
    if (paginate) {
      totalCustomers = await Customers.countDocuments();
    } else {
      totalCustomers = customers.length;
    }

    res.status(200).json({
      message: "Data successfully fetched",
      status: 200,
      data: {
        records: customers,
        pagination: paginate ? {
          total: totalCustomers,
          page: page,
          limit: limit,
          totalPages: Math.ceil(totalCustomers / limit),
        } : undefined,
      }
    });

  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({
      message: 'Internal server error',
      status: 500,
      data: {
        records: [],
        pagination: undefined
      }
    })
  }
};

module.exports = {
  getGenderDistribution,
  getAllCustomers,
};