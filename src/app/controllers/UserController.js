import User from '../models/User';

class UserController {
  // METHOD TO SHOW THE USERS

  async show(req, res) {
    const { id } = req.params;

    if (id) {
      const user = await User.findOne(
        {
          _id: id,
        },
        {
          email: 1,
          name: 1,
          isAdmin: 1,
        }
      );

      return res.status(200).json(user);
    }

    const users = await User.find(
      {},
      {
        email: 1,
        name: 1,
        isAdmin: 1,
      }
    );

    return res.status(200).json(users);
  }

  //  METHOD TO CREATE A NEW USER
  async store(req, res) {
    const { email, name, password, isAdmin } = req.body;

    const alreadyExists = await User.findOne({
      email,
    });

    if (alreadyExists)
      return res.status(400).json({
        error: 'Already have an user with this e-mail',
      });

    const userCreate = await User.create({
      email,
      name,
      password,
      isAdmin,
    });

    return res.status(200).json(userCreate);
  }
}

export default new UserController();
