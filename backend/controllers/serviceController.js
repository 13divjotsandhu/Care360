const Service = require('../models/Service');

// Get all services
const getServices = async (req, res) => {
  try {
    // Find all documents in the services collection
    console.log("Fetching all services..."); // Log the action
    const services = await Service.find({}); // Fetch all services without any filter

    // Send the found services back as a JSON response
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: 'Unable to get services' });
  }
};
    


// Add a new service
const addService = async (req, res) => {  
  const { name, description, price, duration } = req.body;
  try {
    // Validate required fields (basic check)
     if (!name || !description || price === undefined || duration === undefined) {
         return res.status(400).json({ message: 'Missing required service fields (name, description, price, duration).' });
     }    
    const service = await Service.create({ name, description, price, duration });
    console.log("Service added:", service ); // Log successful creation
    
   res.status(201).json(service);
  } catch (error) {
    console.error("Error adding service:", error);
    if (error.name === 'ValidationError') {
        res.status(400).json({ message: 'Failed to add service due to invalid data', error: error.message });
    } else {
        res.status(500).json({ message: 'Failed to add service due to server error', error: error.message });
    }
  }
};

module.exports = {getServices,addService,};