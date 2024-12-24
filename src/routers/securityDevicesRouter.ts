import {Router} from "express";
import {SecurityDevicesController} from "../controllers/SecurityDevicesController";
import {validateBearerAuthorization} from "../middlewares/auth/auth-bearer";
import {
    validationDeviceOwner,
    validationDevicesFindByParamId
} from "../middlewares/validations/find-by-id/device-validation";
import {validateErrorsMiddleware} from "../middlewares/general-errors-validator";
import {container} from "../composition-root";

export const securityDevicesRouter = Router({});

const securityDevicesController = container.resolve(SecurityDevicesController)

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
