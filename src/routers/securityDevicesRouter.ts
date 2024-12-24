import {Router} from "express";
import {SecurityDevicesController} from "../controllers/securityDevicesController";
import {validateBearerAuthorization} from "../middlewares/auth/auth-bearer";
import {
    validationDeviceOwner,
    validationDevicesFindByParamId
} from "../middlewares/validations/find-by-id/device-validation";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";

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
    validateBearerAuthorization,
    validateErrorsMiddleware,
    securityDevicesController.deleteAllOldDevices.bind(securityDevicesController)
)
