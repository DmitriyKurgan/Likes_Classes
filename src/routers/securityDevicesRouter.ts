import {Router} from "express";
import {
    authMiddleware,
    validateErrorsMiddleware, validationDeviceOwner, validationDevicesFindByParamId,
} from "../middlewares/middlewares";
import {SecurityDevicesController} from "../controllers/securityDevicesController";

export const securityDevicesRouter = Router({});

const securityDevicesController = new SecurityDevicesController()
securityDevicesRouter.get(
    '/',
    securityDevicesController.getAllUserDevices.bind(securityDevicesController)
)


securityDevicesRouter.delete(
    '/:deviceId',
    validationDevicesFindByParamId,
    validateErrorsMiddleware,
    validationDeviceOwner,
    securityDevicesController.deleteDevice.bind(securityDevicesController)
)


securityDevicesRouter.delete(
    '/',
    authMiddleware,
    validateErrorsMiddleware,
    securityDevicesController.deleteAllOldDevices.bind(securityDevicesController)
)
