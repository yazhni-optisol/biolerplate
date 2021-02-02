const UserSerializer = {
  serialize(user) {
    const { id, name, email, phone, isDeleted, otpCode, isVerified } = user;
    return {
      id,
      name,
      email,
      phone,
      isDeleted,
      otpCode,
      isVerified,
    };
  },
};

module.exports = UserSerializer;
