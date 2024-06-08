const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    getSingleUser: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
    getMe: async (parent, args, context) => {
      // If a user is logged in properly
      if (context.user) {
        // Return their info
        return User.findOne({ _id: context.user._id });
      }
      // Otherwise, throw an error
      throw AuthenticationError;
    }
  },

  Mutation: {
    createUser: async (parent, { username, email, password }) => {
      // Create a new User
      const user = await User.create({ username, email, password });
      // Sign a token
      const token = signToken(user);
      // Return the token and new User info
      return { token, user }
    },
    login: async (parent, { username, email, password }) => {
      // Get User information using username or email provided
      const user = User.findOne({ $or: [{ username }, { email }] })

      // If user wasn't found, throw an error
      if (!user) {
        throw AuthenticationError;
      }
      // Check if the password supplied matches records using custom method
      const correctPW = await user.isCorrectPassword(password);
      // If password wasn't authorized, throw an error
      if (!correctPW) {
        throw AuthenticationError;
      }
      // Sign a token
      const token = signToken(user);
      // return the token and user info
      return { token, user }
    },
    saveBook: async (parent, { book }, context) => {
      // If a user is logged in properly
      if (context.user) {
        // Update user savedBooks to include book if not already there
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true }
        );
        // Return user info
        return updatedUser
      }
      // Otherwise, throw an error
      throw AuthenticationError
    },
    deleteBook: async (parent, { bookId }, context) => {
      // If a user is logged in properly
      if (context.user) {
        // Update user savedBooks to remove book if not already there
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true },
        )
        // Return user info
        return updatedUser
      }
      // Otherwise, throw an error
      throw AuthenticationError
    },
  },
};

module.exports = resolvers;
