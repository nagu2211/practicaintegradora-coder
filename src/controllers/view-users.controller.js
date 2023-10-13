import { recoverCodeService } from '../services/recoverCode.service.js';
import { userService } from '../services/user.service.js';
import { createHash } from '../utils/bcrypt.js';
import { formatCurrentDate } from '../utils/currentDate.js';
import { UserModelMongoose } from '../DAO/mongo/models/user.model.mongoose.js';
import { emailService } from '../services/email.service.js';
class ViewUsersController {
  allUsers = async (req, res) => {
    try {
      const allUsers = await userService.getAll();
      return res.status(200).render('users', { allUsers });
      // return res.status(200).json({
      //   status: 'success',
      //   msg: 'all users',
      //   payload: users,
      // });
    } catch (e) {
      req.logger.error(`Error in home : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'unexpected error on the server' });
    }
  };
  deleteUserForInactivity = async (req, res) => {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const inactiveUsers = await UserModelMongoose.find({ last_connection: { $lt: oneMinuteAgo } });
      const emailSentDueToInactivity = await emailService.emailSentDueToInactivity(inactiveUsers);
      const deletedUsers = await UserModelMongoose.deleteMany({ last_connection: { $lt: oneMinuteAgo } });

      res.json({ message: `Deleted users ${deletedUsers.deletedCount} : a warning email has been sent to all deleted users` });
    } catch (error) {
      res.status(500).json({ error: 'Error while deleting inactive users.' });
    }
  };
  home = async (req, res) => {
    try {
      return res.status(200).render('home');
    } catch (e) {
      req.logger.error(`Error in home : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'unexpected error on the server' });
    }
  };
  login = async (req, res) => {
    try {
      return res.status(200).render('login');
    } catch (e) {
      req.logger.error(`Error in login view-users : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'unexpected error on the server' });
    }
  };
  register = async (req, res) => {
    try {
      return res.status(200).render('register');
    } catch (e) {
      req.logger.error(`Error in register view-users : ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'unexpected error on the server' });
    }
  };
  logout = async (req, res) => {
    const email = req.session.user.email;
    const updateCon = await userService.updateLastConnection(email);

    req.session.destroy((err) => {
      if (err) {
        req.logger.error(`Error in logout view-users : ${err.message}` + formatCurrentDate);
        return res.status(401).render('error-page', { msg: 'logout error' });
      }
      res.redirect('/');
    });
  };
  failRegister = async (_, res) => {
    return res.status(401).render('error-page', { msg: 'failure to register the user' });
  };
  failLogin = async (_, res) => {
    return res.status(401).render('error-page', { msg: 'password or invalid user' });
  };
  forgotPassword = async (_, res) => {
    return res.status(200).render('forgotPassword');
  };
  resetPassword = async (req, res) => {
    const { code, email } = req.query;
    const foundCode = await recoverCodeService.findOne(code, email);
    if (foundCode && foundCode.expire > Date.now()) {
      res.status(200).render('resetPassword', { code, email });
    } else {
      res.status(400).render('forgotPassword', { msg: 'your code expired or is invalid' });
    }
  };
  changePassword = async (req, res) => {
    let { code, email, password } = req.body;
    const foundCode = await recoverCodeService.findOne(code, email);
    if (foundCode && foundCode.expire > Date.now()) {
      password = createHash(password);
      const updatedUser = await userService.updateOneResetPass(email, password);
      res.status(200).render('success', { msg: 'your password was reset correctly' });
    } else {
      res.status(400).render('forgotPassword', { msg: 'your code expired or is invalid' });
    }
  };
  changeRole = async (req, res) => {
    try {
      const uid = req.params.uid;
      const user = await userService.findUserById(uid);
      const existingAccount = user.documents.some((documento) => documento.name === 'cuenta');
      const existingIdentification = user.documents.some((documento) => documento.name === 'identificacion');
      const existingAdress = user.documents.some((documento) => documento.name === 'domicilio');
      if (!user) {
        return res.status(404).render('error-page', { msg: 'user not found' });
      } else if (user.role == 'premium') {
        const toggleUserRole = await userService.toggleUserRole(uid);
        res.status(200).render('success', { msg: 'user role was successfully changed , role : ' + toggleUserRole });
      } else {
        if (existingAccount && existingIdentification && existingAdress) {
          const toggleUserRole = await userService.toggleUserRole(uid);

          res.status(200).render('success', { msg: 'user role was successfully changed , role : ' + toggleUserRole });
        } else {
          return res.status(403).render('error-page', { msg: 'the user has not finished processing their documentation. ' });
        }
      }
    } catch (e) {
      req.logger.error(`Error when trying to change the role ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'server error : it has not been possible to change the role of the user' });
    }
  };
  deleteUser = async (req, res) => {
    try {
      const { _id } = req.params;
      const deleteUser = await userService.deleteOne(_id);
      if (!deleteUser) {
        return res.status(404).render('error-page', { msg: 'user not found' });
      } else {
        return res.status(200).render('success', { msg: 'deleted user' });
      }
    } catch (e) {
      req.logger.error(`Error when trying to delete the user ${e.message}` + formatCurrentDate);
      return res.status(500).render('error-page', { msg: 'server error : it has not been possible to delete the user' });
    }
  };
}

export const viewUsersController = new ViewUsersController();
