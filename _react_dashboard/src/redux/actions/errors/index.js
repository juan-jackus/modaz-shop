const errorsHandler = async (error, actionName, dispatch) => {
  // console.log(error?.response);
  if (error?.response) {
    // eslint-disable-next-line
    if (error.response?.data == 'Unauthenticated') {
      await dispatch({
        type: 'LOGOUT',
      });
    } else if (error.response?.data?.errorObj && actionName) {
      await dispatch({
        type: actionName,
        data: error.response.data.errorObj,
      });
    } else {
      await dispatch({
        type: 'NETWORK_ERRORS',
        data: error.response?.data?.message || 'A network error occured!',
      });
    }
  } else {
    await dispatch({
      type: 'NETWORK_ERRORS',
    });
  }
};

export default errorsHandler;
