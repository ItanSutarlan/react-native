// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  if (error.name === 'AxiosError') {
    const { response } = error;
    res.status(response.status).json({ message: response.data.message });
  } else {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
