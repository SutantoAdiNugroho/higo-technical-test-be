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
  const searchName = req.query.name || '';
  const filterGender = req.query.gender || '';

  try {
    let matchConditions = {};

    if (searchName) 
      matchConditions.name = { $regex: searchName, $options: 'i' };

    if (filterGender && filterGender !== 'All') 
      matchConditions.gender = filterGender;

    let customersQuery= [
      { $match: matchConditions },
      {
        $project: {
          id: '$_id',
          _id: 0,
          number: 1,
          nameOfLocation: 1,
          date: 1,
          loginHour: 1,
          name: 1,
          age: 1,
          gender: 1,
          email: 1,
          phoneNumber: 1,
          brandDevice: 1,
          digitalInterest: 1,
          locationType: 1,
          createdAt: 1,
        }
      }
    ];

    let totalCustomersQuery = [
      { $match: matchConditions },
      { $count: 'total' }
    ];

    let totalCustomers = 0;
    
    if (paginate) {
      const countResult = await Customers.aggregate(totalCustomersQuery);
      totalCustomers = countResult.length > 0 ? countResult[0].total : 0;

      const skip = (page - 1) * limit;
      customersQuery.push({ $skip: skip });
      customersQuery.push({ $limit: limit });
    } else {
      const allMatchingCustomers = await Customers.aggregate([
        { $match: matchConditions },
        { $count: 'total' }
      ]);
      totalCustomers = allMatchingCustomers.length > 0 ? allMatchingCustomers[0].total : 0;
    }

    const customers = await Customers.aggregate(customersQuery);

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
    });
  }
};

module.exports = {
  getGenderDistribution,
  getAllCustomers,
};