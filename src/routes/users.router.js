import express from 'express';
import { viewUsersController } from '../controllers/view-users.controller.js';
import { uploader } from '../utils/multer.js';
import { UserModelMongoose } from '../DAO/mongo/models/user.model.mongoose.js';
import env from '../config/environment.config.js';
export const usersRouter = express.Router();

usersRouter.post('/premium/:uid', viewUsersController.changeRole);

usersRouter.post('/reset-password', viewUsersController.changePassword);

usersRouter.post('/:uid/documents',uploader.fields([
  { name: 'identificacion', maxCount: 1 },
  { name: 'domicilio', maxCount: 1 },
  { name: 'cuenta', maxCount: 1 },
]), async (req, res) => {
  if (!req.files) {
    return res.status(400).json({
      status: 'error',
      msg: 'sube un archivo',
      data: {},
    });
  }
  const uid = req.params.uid; 
  const { identificacion, domicilio, cuenta } = req.files;
  
  try {
    const updatedUser = await UserModelMongoose.findByIdAndUpdate(
      uid,
      {
        $push: {
          documents: {
            $each: [
              {
                name: identificacion[0].fieldname,
                reference: env.apiUrl + "/" + identificacion[0].filename
              },
              {
                name: domicilio[0].fieldname,
                reference: env.apiUrl + "/" + domicilio[0].filename 
              },
              {
                name: cuenta[0].fieldname,
                reference: env.apiUrl + "/" + cuenta[0].filename
              }
            ]
          }
        }
      },
      { new: true } 
    );
  
    if (!updatedUser) {
      return res.status(404).json({ status: "error", msg: "Usuario no encontrado" });
    }
  
    return res.status(201).json({ status: "success", data: updatedUser });
  } catch (error) {
    console.error(`Error al agregar documento: ${error.message}`);
    return res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});

usersRouter.get('/', viewUsersController.allUsers);
usersRouter.delete('/', viewUsersController.deleteUserForInactivity);
usersRouter.delete('/:_id', viewUsersController.deleteUser);