// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  if (error.name === 'Data not found') {
    res.status(404).json({ message: error.name });
  } else if (
    error.name === 'Email is required' ||
    error.name === 'Password is required'
  ) {
    res.status(400).json({ message: error.name });
  } else if (error.name === 'Invalid email/password') {
    res.status(401).json({ message: error.name });
  } else {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
