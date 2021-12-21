const AuthReducer = (state, action) => {
  switch (action.type) {
    case "ACCESS_TOKEN_SUCCESS":
      return {
        token: {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
        },
        user: action.payload.user,
        isFetching: false,
        error: false,
      };
    case "LOGIN_START":
      return {
        token: {
          access_token: null,
          refresh_token: null,
        },
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        token: {
          access_token: action.payload.access_token,
          refresh_token: action.payload.refresh_token,
        },
        user: action.payload.user,
        isFetching: false,
        error: false,
      };
    case "LOGIN_FAILURE":
      return {
        token: {
          access_token: null,
          refresh_token: null,
        },
        user: null,
        isFetching: false,
        error: true,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.filter(
            (following) => following !== action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;
