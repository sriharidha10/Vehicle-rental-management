const initialState = {
  user: null,
  loading: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_USER':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        user: null,
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export default userReducer; 