/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 836:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.messageHandler = void 0;
const users_1 = __webpack_require__(291);
const messageHandler = (message) => {
    switch (message.method) {
        case 'getAllUsers':
            return (0, users_1.getAllUsers)();
        case 'getUser':
            return (0, users_1.getUser)(message.param);
        case 'addUser':
            return (0, users_1.addUser)(message.param);
        case 'updateUser':
            return (0, users_1.updateUser)(message.param);
        case 'deleteUser':
            return (0, users_1.deleteUser)(message.param);
    }
};
exports.messageHandler = messageHandler;


/***/ }),

/***/ 291:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = exports.getAllUsers = void 0;
const uuid_1 = __webpack_require__(104);
const users = [];
function getAllUsers() {
    return {
        code: 200 /* StatusCodes.OK */,
        data: users,
    };
}
exports.getAllUsers = getAllUsers;
function getUser(id) {
    if (!(0, uuid_1.validate)(id)) {
        return {
            code: 400 /* StatusCodes.BadRequest */,
            data: 'Invalid ID! Please check the input value and try again.',
        };
    }
    const user = users.find((user) => user.id == id);
    if (!user) {
        return {
            code: 404 /* StatusCodes.NotFound */,
            data: 'User not found! Please make sure you have entered a valid ID.',
        };
    }
    return {
        code: 200 /* StatusCodes.OK */,
        data: user,
    };
}
exports.getUser = getUser;
function addUser(user) {
    user.id = (0, uuid_1.v4)();
    const isCorrectHobbies = user.hobbies instanceof Array &&
        (user.hobbies.length === 0 ||
            user.hobbies.every((hobby) => typeof hobby === 'string'));
    if (!(typeof user.username === 'string') ||
        !user.username.trim() ||
        !(typeof user.age === 'number') ||
        !isCorrectHobbies) {
        return {
            code: 400 /* StatusCodes.BadRequest */,
            data: 'Invalid input! Please make sure you have provided a valid username, age and hobbies.',
        };
    }
    users.push(user);
    return { code: 201 /* StatusCodes.Created */, data: user };
}
exports.addUser = addUser;
function updateUser(newUser) {
    if (!newUser.id || !(0, uuid_1.validate)(newUser.id)) {
        return {
            code: 400 /* StatusCodes.BadRequest */,
            data: 'Invalid ID! Please check the input value and try again.',
        };
    }
    const idx = users.findIndex((user) => user.id == newUser.id);
    if (idx < 0) {
        return {
            code: 404 /* StatusCodes.NotFound */,
            data: 'User not found! Please make sure you have entered a valid ID.',
        };
    }
    if (Object.keys(newUser).some((key) => !['id', 'username', 'age', 'hobbies'].includes(key))) {
        return {
            code: 400 /* StatusCodes.BadRequest */,
            data: 'Invalid field! Only username, age, and hobbies are allowed for update.',
        };
    }
    if (newUser.username) {
        if (typeof newUser.username === 'string') {
            users[idx].username = newUser.username;
        }
        else {
            return {
                code: 400 /* StatusCodes.BadRequest */,
                data: 'Invalid username! Please provide a valid string value for username.',
            };
        }
    }
    if (newUser.age) {
        if (typeof newUser.age === 'number') {
            users[idx].age = newUser.age;
        }
        else {
            return {
                code: 400 /* StatusCodes.BadRequest */,
                data: 'Invalid age! Please provide a valid number value for age.',
            };
        }
    }
    if (newUser.hobbies) {
        if (newUser.hobbies instanceof Array &&
            newUser.hobbies.every((hobby) => typeof hobby === 'string')) {
            if (newUser.hobbies.length)
                users[idx].hobbies = newUser.hobbies;
        }
        else {
            return {
                code: 400 /* StatusCodes.BadRequest */,
                data: 'Invalid hobbies! Please provide a valid array of strings for hobbies.',
            };
        }
    }
    return { code: 200 /* StatusCodes.OK */, data: users[idx] };
}
exports.updateUser = updateUser;
function deleteUser(id) {
    if (!(0, uuid_1.validate)(id)) {
        return {
            code: 400 /* StatusCodes.BadRequest */,
            data: 'Invalid ID! Please check the input value and try again.',
        };
    }
    const idx = users.findIndex((user) => user.id == id);
    if (idx < 0) {
        return {
            code: 404 /* StatusCodes.NotFound */,
            data: 'User not found! Please make sure you have entered a valid ID.',
        };
    }
    const user = users[idx];
    users.splice(idx, 1);
    return { code: 204 /* StatusCodes.NoContent */, data: user };
}
exports.deleteUser = deleteUser;


/***/ }),

/***/ 740:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.server = void 0;
const dotenv = __importStar(__webpack_require__(520));
const http_1 = __importDefault(__webpack_require__(136));
const server_1 = __webpack_require__(652);
dotenv.config();
const mainPort = Number(process.env.PORT) || 5000;
const host = process.env.HOST || 'localhost';
exports.server = http_1.default.createServer(server_1.webServer);
exports.server.listen(mainPort, host, () => {
    console.log(`Server is started! Listening on port ${mainPort}`);
});
exports.server.on('connection', (socket) => console.log(`Connecting in port: ${socket.localPort}`));


/***/ }),

/***/ 652:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.webServer = void 0;
const types_1 = __webpack_require__(76);
const cluster_1 = __importDefault(__webpack_require__(840));
const handler_1 = __webpack_require__(836);
const USERS_URL = '/api/users';
const USER_DETAILS_URL = '/api/users/';
const writeToResponse = (res, data) => {
    res.statusCode = data.code;
    if (data.code.toString()[0] === '2') {
        res.setHeader('Content-type', 'application/json');
        res.write(JSON.stringify(data.data));
    }
    else {
        res.setHeader('Content-type', 'text/plain');
        res.write(data.data);
    }
    res.end();
};
const writeErrorResponse = (res, message, code) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/plain');
    res.write(message);
    res.end();
};
const responseData = (res, msgData) => {
    const data = (0, handler_1.messageHandler)(msgData);
    writeToResponse(res, data);
};
const webServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { method: reqMethod, url: reqUrl } = req;
        console.log(`Method: ${req.method} Url: ${req.url}`);
        res.setHeader('Content-Type', 'application/json');
        if (reqMethod === types_1.Methods.get && reqUrl === USERS_URL) {
            //* Get All Users
            const resData = { method: 'getAllUsers', param: null };
            if (cluster_1.default.isWorker) {
                process.send(resData);
            }
            else {
                responseData(res, resData);
            }
        }
        else if (reqMethod === types_1.Methods.get &&
            (reqUrl === null || reqUrl === void 0 ? void 0 : reqUrl.startsWith(USER_DETAILS_URL))) {
            //* Get One User
            const id = reqUrl.substring(USER_DETAILS_URL.length);
            const resData = { method: 'getUser', param: id };
            if (cluster_1.default.isWorker) {
                process.send(resData);
            }
            else {
                responseData(res, resData);
            }
        }
        else if (reqMethod === types_1.Methods.post && reqUrl === USERS_URL) {
            //* Create New User
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
                try {
                    const resData = {
                        method: 'addUser',
                        param: JSON.parse(body),
                    };
                    if (cluster_1.default.isWorker) {
                        process.send(resData);
                    }
                    else {
                        responseData(res, resData);
                    }
                }
                catch (error) {
                    writeErrorResponse(res, 'Invalid JSON format', 400 /* StatusCodes.BadRequest */);
                }
            });
        }
        else if (reqMethod === types_1.Methods.put &&
            (reqUrl === null || reqUrl === void 0 ? void 0 : reqUrl.startsWith(USER_DETAILS_URL))) {
            //* Update User
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
                var _a;
                try {
                    const id = (_a = req.url) === null || _a === void 0 ? void 0 : _a.substring(USER_DETAILS_URL.length);
                    const user = JSON.parse(body);
                    user.id = id;
                    const resData = {
                        method: 'updateUser',
                        param: user,
                    };
                    if (cluster_1.default.isWorker) {
                        process.send(resData);
                    }
                    else {
                        responseData(res, resData);
                    }
                }
                catch (error) {
                    writeErrorResponse(res, 'Invalid JSON format', 400 /* StatusCodes.BadRequest */);
                }
            });
        }
        else if (reqMethod === types_1.Methods.delete &&
            (reqUrl === null || reqUrl === void 0 ? void 0 : reqUrl.startsWith(USER_DETAILS_URL))) {
            //* Delete User
            const id = reqUrl.substring(USER_DETAILS_URL.length);
            const resData = { method: 'deleteUser', param: id };
            if (cluster_1.default.isWorker) {
                process.send(resData);
            }
            else {
                responseData(res, resData);
            }
        }
        else {
            //* Error Request
            const msg = 'Oops! The resource you are looking for could not be found.';
            writeErrorResponse(res, msg, 404 /* StatusCodes.NotFound */);
        }
    }
    catch (error) {
        res.write(JSON.stringify({
            code: 500 /* StatusCodes.InternalServerError */,
            message: 'Sorry, an internal server error has occurred. Please try again later',
        }));
        res.end();
    }
    // if (cluster.isWorker) {
    //     const data: UserResponse = await new Promise((resolve) => {
    //         process.on('message', (data: UserResponse) => {
    //             resolve(data)
    //         })
    //     })
    //     writeToResponse(res, data)
    // }
});
exports.webServer = webServer;


/***/ }),

/***/ 76:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Methods = void 0;
var Methods;
(function (Methods) {
    Methods["get"] = "GET";
    Methods["post"] = "POST";
    Methods["put"] = "PUT";
    Methods["delete"] = "DELETE";
})(Methods || (exports.Methods = Methods = {}));


/***/ }),

/***/ 520:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 104:
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ 840:
/***/ ((module) => {

module.exports = require("cluster");

/***/ }),

/***/ 136:
/***/ ((module) => {

module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(740);
/******/ 	
/******/ })()
;