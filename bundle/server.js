/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 901:
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
const dotenv = __importStar(__webpack_require__(142));
const cluster_1 = __importDefault(__webpack_require__(1));
const http_1 = __importDefault(__webpack_require__(685));
const os_1 = __webpack_require__(37);
const server_1 = __webpack_require__(728);
dotenv.config();
const mainPort = Number(process.env.PORT) || 5000;
const numCPUs = (0, os_1.cpus)().length;
if (cluster_1.default.isPrimary) {
    console.log(`Master process is started! Number of CPU cores: ${numCPUs}`);
    const workers = [];
    for (let i = 0; i < (0, os_1.cpus)().length; i++) {
        const workerEnv = { port: (mainPort + i + 1).toString() };
        const worker = cluster_1.default.fork(workerEnv);
        workers.push(worker);
    }
    let activeWorkerPort = mainPort + 1;
    const mainServer = http_1.default.createServer((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        const httpRequest = http_1.default.request({
            hostname: 'localhost',
            port: activeWorkerPort,
            path: request.url,
            method: request.method,
            headers: request.headers,
        }, (res) => {
            const data = [];
            res.on('data', (chunk) => {
                data.push(chunk);
            });
            res.on('end', () => {
                response.write(data.join().toString());
                response.end();
            });
        });
        const data = [];
        request.on('data', (chunk) => {
            data.push(chunk);
        });
        request.on('end', () => {
            httpRequest.write(data.join().toString());
            httpRequest.end();
        });
        activeWorkerPort =
            activeWorkerPort < mainPort + (0, os_1.cpus)().length
                ? activeWorkerPort + 1
                : mainPort + 1;
    }));
    mainServer.listen(mainPort, 'localhost', () => {
        console.log(`Main server listening on port ${mainPort}`);
    });
}
if (cluster_1.default.isWorker) {
    const workerPort = parseInt(process.env.PORT || '5000') + cluster_1.default.worker.id;
    const server = http_1.default.createServer(server_1.webServer);
    server.listen(workerPort, 'localhost', () => {
        console.log(`Worker process is started! Listening on port ${workerPort}`);
    });
    server.on('connection', (socket) => console.log(`Connecting in port: ${socket.localPort}`));
}


/***/ }),

/***/ 343:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = exports.getAllUsers = void 0;
const uuid_1 = __webpack_require__(828);
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
    if (!user)
        return {
            code: 404 /* StatusCodes.NotFound */,
            data: 'User not found! Please make sure you have entered a valid ID.',
        };
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
function updateUser(user) {
    if (!user.id || !(0, uuid_1.validate)(user.id)) {
        return {
            code: 400 /* StatusCodes.BadRequest */,
            data: 'Invalid ID! Please check the input value and try again.',
        };
    }
    const idx = users.findIndex((_user) => _user.id == user.id);
    if (idx < 0)
        return {
            code: 404 /* StatusCodes.NotFound */,
            data: 'User not found! Please make sure you have entered a valid ID.',
        };
    if (typeof user.username == 'string')
        users[idx].username = user.username;
    if (typeof user.age == 'number')
        users[idx].age = user.age;
    if (user.hobbies instanceof Array) {
        user.hobbies.forEach((hobby) => {
            if (!user.hobbies.includes(hobby))
                this.users[idx].hobbies.push(hobby);
        });
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
    if (idx < 0)
        return {
            code: 404 /* StatusCodes.NotFound */,
            data: 'User not found! Please make sure you have entered a valid ID.',
        };
    const user = users[idx];
    users.splice(idx, 1);
    return { code: 204 /* StatusCodes.NoContent */, data: user };
}
exports.deleteUser = deleteUser;


/***/ }),

/***/ 728:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.webServer = void 0;
const users_1 = __webpack_require__(343);
const types_1 = __webpack_require__(230);
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
const webServer = (req, res) => {
    try {
        console.log(`Method: ${req.method} Url: ${req.url}`);
        res.setHeader('Content-Type', 'application/json');
        const { method: reqMethod, url: reqUrl } = req;
        if (reqMethod === types_1.Methods.get && reqUrl === USERS_URL) {
            //* Get All Users
            const resData = (0, users_1.getAllUsers)();
            writeToResponse(res, resData);
        }
        else if (reqMethod === types_1.Methods.get &&
            (reqUrl === null || reqUrl === void 0 ? void 0 : reqUrl.startsWith(USER_DETAILS_URL))) {
            //* Get One User
            const id = reqUrl.substring(USER_DETAILS_URL.length);
            const resData = (0, users_1.getUser)(id);
            writeToResponse(res, resData);
        }
        else if (reqMethod === types_1.Methods.post && reqUrl === USERS_URL) {
            //* Create New User
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
                const resData = (0, users_1.addUser)(JSON.parse(body));
                writeToResponse(res, resData);
            });
        }
        else if (reqMethod === types_1.Methods.put &&
            (reqUrl === null || reqUrl === void 0 ? void 0 : reqUrl.startsWith(USER_DETAILS_URL))) {
            //* Update User
            let body = '';
            req.on('data', (chunk) => (body += chunk));
            req.on('end', () => {
                var _a;
                const id = (_a = req.url) === null || _a === void 0 ? void 0 : _a.substring(USER_DETAILS_URL.length);
                const user = JSON.parse(body);
                user.id = id;
                const resData = (0, users_1.updateUser)(user);
                writeToResponse(res, resData);
            });
        }
        else if (reqMethod === types_1.Methods.delete &&
            (reqUrl === null || reqUrl === void 0 ? void 0 : reqUrl.startsWith(USER_DETAILS_URL))) {
            //* Delete User
            const id = reqUrl.substring(USER_DETAILS_URL.length);
            const resData = (0, users_1.deleteUser)(id);
            writeToResponse(res, resData);
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
};
exports.webServer = webServer;


/***/ }),

/***/ 230:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageMethod = exports.Methods = void 0;
var Methods;
(function (Methods) {
    Methods["get"] = "GET";
    Methods["post"] = "POST";
    Methods["put"] = "PUT";
    Methods["delete"] = "DELETE";
})(Methods || (exports.Methods = Methods = {}));
var MessageMethod;
(function (MessageMethod) {
    MessageMethod["getAllUsers"] = "getAllUsers";
    MessageMethod["getUser"] = "getUser";
    MessageMethod["addUser"] = "addUser";
    MessageMethod["updateUser"] = "updateUser";
    MessageMethod["deleteUser"] = "deleteUser";
})(MessageMethod || (exports.MessageMethod = MessageMethod = {}));


/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 828:
/***/ ((module) => {

module.exports = require("uuid");

/***/ }),

/***/ 1:
/***/ ((module) => {

module.exports = require("cluster");

/***/ }),

/***/ 685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 37:
/***/ ((module) => {

module.exports = require("os");

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
/******/ 	var __webpack_exports__ = __webpack_require__(901);
/******/ 	
/******/ })()
;