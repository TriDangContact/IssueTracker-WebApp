/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "7e08b22aaed28b840f54";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "server";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!*****************************************!*\
  !*** (webpack)/hot/log-apply-result.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
  var unacceptedModules = updatedModules.filter(function (moduleId) {
    return renewedModules && renewedModules.indexOf(moduleId) < 0;
  });

  var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

  if (unacceptedModules.length > 0) {
    log("warning", "[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
    unacceptedModules.forEach(function (moduleId) {
      log("warning", "[HMR]  - " + moduleId);
    });
  }

  if (!renewedModules || renewedModules.length === 0) {
    log("info", "[HMR] Nothing hot updated.");
  } else {
    log("info", "[HMR] Updated modules:");
    renewedModules.forEach(function (moduleId) {
      if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
        var parts = moduleId.split("!");
        log.groupCollapsed("info", "[HMR]  - " + parts.pop());
        log("info", "[HMR]  - " + moduleId);
        log.groupEnd("info");
      } else {
        log("info", "[HMR]  - " + moduleId);
      }
    });
    var numberIds = renewedModules.every(function (moduleId) {
      return typeof moduleId === "number";
    });
    if (numberIds) log("info", "[HMR] Consider using the NamedModulesPlugin for module names.");
  }
};

/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!****************************!*\
  !*** (webpack)/hot/log.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
  var shouldLog = logLevel === "info" && level === "info" || ["info", "warning"].indexOf(logLevel) >= 0 && level === "warning" || ["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error";
  return shouldLog;
}

function logGroup(logFn) {
  return function (level, msg) {
    if (shouldLog(level)) {
      logFn(msg);
    }
  };
}

module.exports = function (level, msg) {
  if (shouldLog(level)) {
    if (level === "info") {
      console.log(msg);
    } else if (level === "warning") {
      console.warn(msg);
    } else if (level === "error") {
      console.error(msg);
    }
  }
};
/* eslint-disable node/no-unsupported-features/node-builtins */


var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);
module.exports.groupCollapsed = logGroup(groupCollapsed);
module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
  logLevel = level;
};

module.exports.formatError = function (err) {
  var message = err.message;
  var stack = err.stack;

  if (!stack) {
    return message;
  } else if (stack.indexOf(message) < 0) {
    return message + "\n" + stack;
  } else {
    return stack;
  }
};

/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?1000":
/*!**********************************!*\
  !*** (webpack)/hot/poll.js?1000 ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/*globals __resourceQuery */
if (true) {
  var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;

  var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

  var checkForUpdate = function checkForUpdate(fromUpdate) {
    if (module.hot.status() === "idle") {
      module.hot.check(true).then(function (updatedModules) {
        if (!updatedModules) {
          if (fromUpdate) log("info", "[HMR] Update applied.");
          return;
        }

        __webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);

        checkForUpdate(true);
      }).catch(function (err) {
        var status = module.hot.status();

        if (["abort", "fail"].indexOf(status) >= 0) {
          log("warning", "[HMR] Cannot apply update.");
          log("warning", "[HMR] " + log.formatError(err));
          log("warning", "[HMR] You need to restart the application!");
        } else {
          log("warning", "[HMR] Update failed: " + log.formatError(err));
        }
      });
    }
  };

  setInterval(checkForUpdate, hotPollInterval);
} else {}
/* WEBPACK VAR INJECTION */}.call(this, "?1000"))

/***/ }),

/***/ "./server/render.jsx":
/*!***************************!*\
  !*** ./server/render.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/server */ "react-dom/server");
/* harmony import */ var react_dom_server__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom_server__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _src_Page_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../src/Page.jsx */ "./src/Page.jsx");
/* harmony import */ var _template_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./template.js */ "./server/template.js");
/* harmony import */ var _src_store_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../src/store.js */ "./src/store.js");
/* harmony import */ var _src_routes_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../src/routes.js */ "./src/routes.js");
// FOR SERVER SIDE RENDERING


 // need .default since we compiled using Babel




 // we convert a React component to markup and insert it into our template

async function render(req, res) {
  //we fetch our data during server or browser rendering and store it
  // we try to fetch component-specific data by matching URL to each Route's path
  const activeRoute = _src_routes_js__WEBPACK_IMPORTED_MODULE_6__["default"].find(route => Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["matchPath"])(req.path, route));
  let initialData;

  if (activeRoute && activeRoute.component.fetchData) {
    const match = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["matchPath"])(req.path, activeRoute); // get the search query from the URL for fetches that require them

    const index = req.url.indexOf('?');
    const search = index !== -1 ? req.url.substr(index) : null;
    initialData = await activeRoute.component.fetchData(match, search);
  }

  _src_store_js__WEBPACK_IMPORTED_MODULE_5__["default"].initialData = initialData;
  const context = {};
  const element = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["StaticRouter"], {
    location: req.url,
    context: context
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_src_Page_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], null));
  const body = react_dom_server__WEBPACK_IMPORTED_MODULE_1___default.a.renderToString(element);

  if (context.url) {
    // handle the redirect if the Router matched the url
    res.redirect(301, context.url);
  } else {
    // we also pass our data into the template so it can use it during browser rendering part of hydrate()
    res.send(Object(_template_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body, initialData));
  }
}

/* harmony default export */ __webpack_exports__["default"] = (render);

/***/ }),

/***/ "./server/template.js":
/*!****************************!*\
  !*** ./server/template.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return template; });
/* harmony import */ var serialize_javascript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! serialize-javascript */ "serialize-javascript");
/* harmony import */ var serialize_javascript__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(serialize_javascript__WEBPACK_IMPORTED_MODULE_0__);
// FOR SERVER SIDE RENDERING

function template(body, data) {
  return `<!DOCTYPE HTML>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Pro MERN Stack</title>
    <link rel="stylesheet" href="/bootstrap/css/bootstrap.min.css" >
    <link rel="stylesheet" href="style.css" >
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://apis.google.com/js/api:client.js"></script>
    <style>
      table.table-hover tr {cursor: pointer;}
      .panel-title a {display: block; width: 100%; cursor: pointer;}
    </style>
  </head>
  <body>
    <!-- Page generated from template. -->
    <div id="contents">${body}</div>
    <script>window.__INITIAL_DATA__ = ${serialize_javascript__WEBPACK_IMPORTED_MODULE_0___default()(data)}</script>
    <script src="/env.js"></script>
    <script src="/vendor.bundle.js"></script>
    <script src="/app.bundle.js"></script>
  </body>
  </html>
  `;
}

/***/ }),

/***/ "./server/uiserver.js":
/*!****************************!*\
  !*** ./server/uiserver.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _render_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render.jsx */ "./server/render.jsx");
/* harmony import */ var http_proxy_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! http-proxy-middleware */ "http-proxy-middleware");
/* harmony import */ var http_proxy_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(http_proxy_middleware__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var source_map_support__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! source-map-support */ "source-map-support");
/* harmony import */ var source_map_support__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(source_map_support__WEBPACK_IMPORTED_MODULE_4__);

 // import proxy from 'http-proxy-middleware';


 //source-map-support makes it convenient to add breakpoints, make error messages more readable


source_map_support__WEBPACK_IMPORTED_MODULE_4___default.a.install();
dotenv__WEBPACK_IMPORTED_MODULE_0___default.a.config();
const app = express__WEBPACK_IMPORTED_MODULE_1___default()();
/* 
code for Hot Module Replacement
Webpack feature that changes modules in the browser while the app is still running, removing the need to refresh the browser whenever a change is made
Application state is retained, updating only the components that is changed
*/

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true'; // if HMR is enabled and we're in dev mode

if (enableHMR && "development" !== 'production') {
  console.log('Adding dev middleware, enabling HMR');

  const webpack = __webpack_require__(/*! webpack */ "webpack");

  const devMiddleware = __webpack_require__(/*! webpack-dev-middleware */ "webpack-dev-middleware");

  const hotMiddleware = __webpack_require__(/*! webpack-hot-middleware */ "webpack-hot-middleware"); // add a new entry point and plugin


  const config = __webpack_require__(/*! ../webpack.config.js */ "./webpack.config.js")[0];

  config.entry.app.push('webpack-hot-middleware/client');
  config.plugins = config.plugins || [];
  config.plugins.push(new webpack.HotModuleReplacementPlugin()); // mount the middleware to the app

  const compiler = webpack(config);
  app.use(devMiddleware(compiler));
  app.use(hotMiddleware(compiler));
}

app.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.static('public')); // Proxy-mode is disabled if we comment out API_PROXY_TARGET in .env

const apiProxyTarget = process.env.API_PROXY_TARGET;

if (apiProxyTarget) {
  app.use('/graphql', http_proxy_middleware__WEBPACK_IMPORTED_MODULE_3___default()({
    target: apiProxyTarget
  }));
  app.use('/auth', http_proxy_middleware__WEBPACK_IMPORTED_MODULE_3___default()({
    target: apiProxyTarget
  }));
  console.log('PROXY MODE: ENABLED');
} else {
  console.log('PROXY MODE: DISABLED');
} // saving the API Endpoint in a global variable so it can be read by browser
// const UI_API_ENDPOINT =
// 	process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql';
// const env = { UI_API_ENDPOINT };


if (!process.env.UI_API_ENDPOINT) {
  process.env.UI_API_ENDPOINT = 'http://localhost:3000/graphql';
}

if (!process.env.UI_SERVER_API_ENDPOINT) {
  process.env.UI_SERVER_API_ENDPOINT = process.env.UI_API_ENDPOINT;
}

if (!process.env.UI_AUTH_ENDPOINT) {
  process.env.UI_AUTH_ENDPOINT = 'http://localhost:3000/auth';
} // saving the env variable in a JS file so the browser can actually read from it


app.get('/env.js', function (req, res) {
  const env = {
    UI_API_ENDPOINT: process.env.UI_API_ENDPOINT,
    UI_AUTH_ENDPOINT: process.env.UI_AUTH_ENDPOINT,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
  };
  res.send(`window.ENV = ${JSON.stringify(env)}`);
}); // using Server-side Rendering
// app.get('/about', render);
// HMR modification, wrapper to ensure the latest render() is called
// return the SSR HTML template for every route

app.get('*', (req, res, next) => {
  Object(_render_jsx__WEBPACK_IMPORTED_MODULE_2__["default"])(req, res, next);
});
const port = process.env.UI_SERVER_PORT || 8000;
app.listen(port, function () {
  console.log(`UI started on port ${port}`);
}); // making sure we accept the HMR

if (true) {
  module.hot.accept(/*! ./render.jsx */ "./server/render.jsx", function() { /* harmony import */ _render_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render.jsx */ "./server/render.jsx");
 });
}

/***/ }),

/***/ "./src/About.jsx":
/*!***********************!*\
  !*** ./src/About.jsx ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return About; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store.js */ "./src/store.js");
/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./graphQLFetch.js */ "./src/graphQLFetch.js");



class About extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    const apiAbout = _store_js__WEBPACK_IMPORTED_MODULE_1__["default"].initialData ? _store_js__WEBPACK_IMPORTED_MODULE_1__["default"].initialData.about : null; // clean the store once we've consumed the data, to prevent other components from incorrectly using it

    delete _store_js__WEBPACK_IMPORTED_MODULE_1__["default"].initialData;
    this.state = {
      apiAbout
    };
  }

  static async fetchData(match, search) {
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_2__["default"])('query {about}');
    return data;
  }

  async componentDidMount() {
    const {
      apiAbout
    } = this.state;

    if (apiAbout == null) {
      const data = await About.fetchData();
      this.setState({
        apiAbout: data.about
      });
    }
  }

  render() {
    const {
      apiAbout
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      className: "text-center"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Issue Tracker version 0.9"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h4", null, apiAbout));
  }

}

/***/ }),

/***/ "./src/Contents.jsx":
/*!**************************!*\
  !*** ./src/Contents.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Contents; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _IssueList_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IssueList.jsx */ "./src/IssueList.jsx");
/* harmony import */ var _IssueReport_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IssueReport.jsx */ "./src/IssueReport.jsx");
/* harmony import */ var _IssueEdit_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IssueEdit.jsx */ "./src/IssueEdit.jsx");
/* harmony import */ var _About_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./About.jsx */ "./src/About.jsx");
/* harmony import */ var _NotFound_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NotFound.jsx */ "./src/NotFound.jsx");
/* harmony import */ var _routes_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./routes.js */ "./src/routes.js");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }









function Contents() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Switch"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Redirect"], {
    exact: true,
    from: "/",
    to: "/issues"
  }), _routes_js__WEBPACK_IMPORTED_MODULE_7__["default"].map(attrs => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Route"], _extends({}, attrs, {
    key: attrs.path
  }))));
}

/***/ }),

/***/ "./src/DateInput.jsx":
/*!***************************!*\
  !*** ./src/DateInput.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DateInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



function displayFormat(date) {
  return date != null ? date.toDateString() : '';
}

function editFormat(date) {
  return date != null ? date.toISOString().substr(0, 10) : '';
}

function unformat(str) {
  const val = new Date(str);
  return Number.isNaN(val.getTime()) ? null : val;
}

class DateInput extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: editFormat(props.value),
      focused: false,
      valid: true
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onFocus() {
    this.setState({
      focused: true
    });
  }

  onBlur(e) {
    //checking to see if our value is valid or not so we can pass the info back to the parent to toggle the error message
    const {
      value,
      valid: oldValid
    } = this.state;
    const {
      onValidityChange,
      onChange
    } = this.props;
    const dateValue = unformat(value);
    const valid = value === '' || dateValue != null;

    if (valid !== oldValid && onValidityChange) {
      onValidityChange(e, valid);
    }

    this.setState({
      focused: false,
      valid
    });
    if (valid) onChange(e, dateValue);
  }

  onChange(e) {
    if (e.target.value.match(/^[\d-]*$/)) {
      this.setState({
        value: e.target.value
      });
    }
  }

  render() {
    const {
      valid,
      focused,
      value
    } = this.state;
    const {
      value: origValue,
      onValidityChange,
      ...props
    } = this.props; // we display it as a Date string if its valid, otherwise just a regular string

    const displayValue = focused || !valid ? value : displayFormat(origValue);
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", _extends({}, props, {
      value: displayValue,
      placeholder: focused ? 'yyyy-mm-dd' : null,
      onFocus: this.onFocus,
      onBlur: this.onBlur,
      onChange: this.onChange
    }));
  }

}

/***/ }),

/***/ "./src/IssueAddNavItem.jsx":
/*!*********************************!*\
  !*** ./src/IssueAddNavItem.jsx ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./graphQLFetch.js */ "./src/graphQLFetch.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");






class IssueAddNavItem extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  showModal() {
    this.setState({
      showing: true
    });
  }

  hideModal() {
    this.setState({
      showing: false
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.hideModal(); // get data from the form and create the issue

    const form = document.forms.issueAdd;
    const issue = {
      owner: form.owner.value,
      title: form.title.value,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10)
    }; // callbacks for ToastWrapper withToast.jsx

    const {
      showError
    } = this.props;
    const query = `mutation issueAdd($issue: IssueInputs!) {
            issueAdd(issue: $issue) {
                id
            }
        }`;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, {
      issue
    }, showError);

    if (data) {
      // we redirect back to the issue's edit page
      const {
        history
      } = this.props;
      history.push(`/edit/${data.issueAdd.id}`);
    }
  }

  render() {
    const {
      showing
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["NavItem"], {
      onClick: this.showModal
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      placement: "left",
      delayShow: 1000,
      overlay: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], {
        id: "create-issue"
      }, "Create Issue")
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Glyphicon"], {
      glyph: "plus"
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Modal"], {
      keyboard: true,
      show: showing,
      onHide: this.hideModal
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Modal"].Header, {
      closeButton: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Modal"].Title, null, "Create Issue")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Modal"].Body, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Form"], {
      name: "issueAdd"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], null, "Title"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      name: "title",
      autoFocus: true
    })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ControlLabel"], null, "Owner"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["FormControl"], {
      name: "owner"
    })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Modal"].Footer, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["ButtonToolbar"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      type: "button",
      bsStyle: "primary",
      onClick: this.handleSubmit
    }, "Submit"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      type: "button",
      bsStyle: "link",
      onClick: this.hideModal
    }, "Cancel")))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_4__["default"])(Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(IssueAddNavItem)));

/***/ }),

/***/ "./src/IssueDetail.jsx":
/*!*****************************!*\
  !*** ./src/IssueDetail.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IssueDetail; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function IssueDetail({
  issue
}) {
  if (issue) {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Description"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("pre", null, issue.description));
  }

  return null;
} // code for pre-SSR changes
// import graphQLFetch from './graphQLFetch.js';
// import Toast from './Toast.jsx';
// export default class IssueDetail extends React.Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			issue: {},
// 			toastVisible: false,
// 			toastMessage: '',
// 			toastType: 'info'
// 		};
// 		this.showError = this.showError.bind(this);
// 		this.dismissToast = this.dismissToast.bind(this);
// 	}
// 	componentDidMount() {
// 		this.loadData();
// 	}
// 	componentDidUpdate(prevProps) {
// 		//checking if we need to load our data again, also prevents infinite looping
// 		const {
// 			match: {
// 				params: { id: prevId }
// 			}
// 		} = prevProps;
// 		const {
// 			match: {
// 				params: { id }
// 			}
// 		} = this.props;
// 		if (prevId !== id) {
// 			this.loadData();
// 		}
// 	}
// 	showError(message) {
// 		this.setState({
// 			toastVisible: true,
// 			toastMessage: message,
// 			toastType: 'danger'
// 		});
// 	}
// 	dismissToast() {
// 		this.setState({
// 			toastVisible: false
// 		});
// 	}
// 	async loadData() {
// 		// retrieve the passed in param
// 		const {
// 			match: {
// 				params: { id }
// 			}
// 		} = this.props;
// 		// fetch the item using the param
// 		const query = `query issue($id: Int!) {
//             issue (id: $id) {
//                 id description
//             }
//         }`;
// 		// need to convert the id from string to int
// 		const ID = parseInt(id);
// 		const vars = {
// 			id: ID
// 		};
// 		const data = await graphQLFetch(query, vars, this.showError);
// 		if (data) {
// 			this.setState({ issue: data.issue });
// 		} else {
// 			this.setState({ issue: {} });
// 		}
// 	}
// 	render() {
// 		const {
// 			issue: { description }
// 		} = this.state;
// 		const { toastVisible, toastMessage, toastType } = this.state;
// 		return (
// 			<div>
// 				<h3>Description</h3>
// 				<pre>{description}</pre>
// 				<Toast
// 					showing={toastVisible}
// 					onDismiss={this.dismissToast}
// 					bsStyle={toastType}
// 				>
// 					{toastMessage}
// 				</Toast>
// 			</div>
// 		);
// 	}
// }

/***/ }),

/***/ "./src/IssueEdit.jsx":
/*!***************************!*\
  !*** ./src/IssueEdit.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graphQLFetch.js */ "./src/graphQLFetch.js");
/* harmony import */ var _NumInput_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./NumInput.jsx */ "./src/NumInput.jsx");
/* harmony import */ var _DateInput_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DateInput.jsx */ "./src/DateInput.jsx");
/* harmony import */ var _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TextInput.jsx */ "./src/TextInput.jsx");
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./store.js */ "./src/store.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var _UserContext_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./UserContext.js */ "./src/UserContext.js");












class IssueEdit extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor() {
    super(); // check to see if existing data exists in the global store

    const issue = _store_js__WEBPACK_IMPORTED_MODULE_8__["default"].initialData ? _store_js__WEBPACK_IMPORTED_MODULE_8__["default"].initialData.issue : null; // delete the data once we've consumed it

    delete _store_js__WEBPACK_IMPORTED_MODULE_8__["default"].initialData;
    this.state = {
      issue,
      invalidFields: {},
      showingValidation: false
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onValidityChange = this.onValidityChange.bind(this);
    this.showValidation = this.showValidation.bind(this);
    this.dismissValidation = this.dismissValidation.bind(this);
  }

  componentDidMount() {
    const {
      issue
    } = this.state;
    if (issue == null) this.loadData();
  } // standard checking to see if we need to re-render the page


  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {
          id: prevId
        }
      }
    } = prevProps;
    const {
      match: {
        params: {
          id
        }
      }
    } = this.props;

    if (id !== prevId) {
      this.loadData();
    }
  } // common fetch function that can be used for browser or server rendering


  static async fetchData(match, search, showError) {
    const query = `query issue($id: Int!) {
            issue(id: $id) {
                id title status owner
                effort created due description
            }
		}`;
    const {
      params: {
        id
      }
    } = match;
    const ID = parseInt(id, 10);
    const vars = {
      id: ID
    };
    const result = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, vars, showError);
    return result;
  } // programmatically set the state for whichever field was changed, using the spread "..." operator


  onChange(event, naturalValue) {
    // since we're using Specialized Inputs, check to see which one we should use
    const {
      name,
      value: textValue
    } = event.target;
    const value = naturalValue === undefined ? textValue : naturalValue;
    this.setState(prevState => ({
      issue: { ...prevState.issue,
        [name]: value
      }
    }));
  } // if any of our inputs aren't valid, they will trigger this callback


  onValidityChange(event, valid) {
    const {
      name
    } = event.target;
    this.setState(prevState => {
      const invalidFields = { ...prevState.invalidFields,
        [name]: !valid
      };
      if (valid) delete invalidFields[name];
      return {
        invalidFields
      };
    });
  }

  showValidation() {
    this.setState({
      showingValidation: true
    });
  }

  dismissValidation() {
    this.setState({
      showingValidation: false
    });
  } // gets triggered by form submit


  async handleSubmit(e) {
    e.preventDefault();
    this.showValidation();
    const {
      issue,
      invalidFields
    } = this.state; // quick checking to make sure there's no invalids

    if (Object.keys(invalidFields).length !== 0) return;
    const query = `mutation issueUpdate($id: Int!
            $changes: IssueUpdateInputs!) {
                issueUpdate(id: $id changes: $changes) {
                    id title status owner effort created due description
                }
            }`; // need to strip the fields that we're not supposed to update

    const {
      id,
      created,
      ...changes
    } = issue; // callbacks for ToastWrapper withToast.jsx

    const {
      showSuccess,
      showError
    } = this.props;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, {
      changes,
      id
    }, showError);

    if (data) {
      this.setState({
        issue: data.issueUpdate
      });
      showSuccess('Updated issue successfully!');
    }
  }

  async loadData() {
    // retrieve the match object so we can get its param
    // and callbacks for ToastWrapper withToast.jsx
    const {
      match,
      showError
    } = this.props;
    const data = await IssueEdit.fetchData(match, null, showError);
    this.setState({
      issue: data ? data.issue : {},
      invalidFields: {}
    });
  }

  render() {
    // pre-check since there's a possibility we didn't initialize it
    const {
      issue
    } = this.state;
    if (issue == null) return null;
    const {
      issue: {
        id
      }
    } = this.state;
    const {
      match: {
        params: {
          id: propsId
        }
      }
    } = this.props; // check to see if we were given a valid id, and that we fetched something, before we render entire thing
    // if we fetched a valid object, its id would've been set as state

    if (id == null) {
      // if the id was valid, it would've been passed in the url
      if (propsId != null) {
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, `Issue with ID ${propsId} not found`);
      } // otherwise, it's still fetching


      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h3", null, "Loading");
    } // if there are any invalid fields, we display a message to inform user


    const {
      invalidFields,
      showingValidation
    } = this.state;
    let validationMessage;

    if (Object.keys(invalidFields).length !== 0 && showingValidation) {
      validationMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Alert"], {
        bsStyle: "danger",
        onDismiss: this.dismissValidation
      }, "Please correct invalid fields before submitting");
    }

    const {
      issue: {
        title,
        status
      }
    } = this.state;
    const {
      issue: {
        owner,
        effort,
        description
      }
    } = this.state;
    const {
      issue: {
        created,
        due
      }
    } = this.state;
    const user = this.context; // render the entire form if we were able to fetch a valid object

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Panel"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Panel"].Heading, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Panel"].Title, null, `Editing issue: ${id}`)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Panel"].Body, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Form"], {
      horizontal: true,
      onSubmit: this.handleSubmit
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Created"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"].Static, null, created.toDateString()))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Status"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: "select",
      name: "status",
      value: status,
      onChange: this.onChange
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "New"
    }, "New"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Assigned"
    }, "Assigned"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Fixed"
    }, "Fixed"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Closed"
    }, "Closed")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Owner"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__["default"],
      name: "owner",
      value: owner,
      onChange: this.onChange,
      key: id
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Effort"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: _NumInput_jsx__WEBPACK_IMPORTED_MODULE_5__["default"],
      name: "effort",
      value: effort,
      onChange: this.onChange,
      key: id
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], {
      validationState: invalidFields.due ? 'error' : null
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Due"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: _DateInput_jsx__WEBPACK_IMPORTED_MODULE_6__["default"],
      name: "due",
      value: due,
      onChange: this.onChange,
      onValidityChange: this.onValidityChange,
      key: id
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"].Feedback, null))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Title"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__["default"],
      size: 50,
      name: "title",
      value: title,
      onChange: this.onChange,
      key: id
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      componentClass: react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"],
      sm: 3
    }, "Description"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      sm: 9
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: _TextInput_jsx__WEBPACK_IMPORTED_MODULE_7__["default"],
      tag: "textarea",
      rows: 8,
      cols: 50,
      name: "description",
      value: description,
      onChange: this.onChange,
      key: id
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      smOffset: 3,
      sm: 6
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ButtonToolbar"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      bsStyle: "primary",
      type: "submit",
      disabled: !user.signedIn
    }, "Submit"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__["LinkContainer"], {
      to: "/issues"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      bsStyle: "link"
    }, "Back"))))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      smOffset: 3,
      sm: 9
    }, validationMessage)))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Panel"].Footer, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: `/edit/${id - 1}`
    }, "Prev"), ' | ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["Link"], {
      to: `/edit/${id + 1}`
    }, "Next")));
  }

} // specify the Context object, for use with Authorization feature


IssueEdit.contextType = _UserContext_js__WEBPACK_IMPORTED_MODULE_10__["default"]; // ToastWrapper hides the static fetchData() function, so we need to add a reference to it to our modified component

const IssueEditWithToast = Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_9__["default"])(IssueEdit);
IssueEditWithToast.fetchData = IssueEdit.fetchData;
/* harmony default export */ __webpack_exports__["default"] = (IssueEditWithToast);

/***/ }),

/***/ "./src/IssueFilter.jsx":
/*!*****************************!*\
  !*** ./src/IssueFilter.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url_search_params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url-search-params */ "url-search-params");
/* harmony import */ var url_search_params__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url_search_params__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__);





class IssueFilter extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor({
    location: {
      search
    }
  }) {
    super();
    const params = new url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a(search);
    this.state = {
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.showOriginalFilter = this.showOriginalFilter.bind(this);
    this.onChangeEffortMin = this.onChangeEffortMin.bind(this);
    this.onChangeEffortMax = this.onChangeEffortMax.bind(this);
  } // making sure that the url and our currently selected filter matches


  componentDidUpdate(prevProps) {
    const {
      location: {
        search: prevSearch
      }
    } = prevProps;
    const {
      location: {
        search
      }
    } = this.props;

    if (prevSearch !== search) {
      this.showOriginalFilter();
    }
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
      changed: true
    });
  }

  onChangeEffortMin(e) {
    const effortString = e.target.value;

    if (effortString.match(/^\d*$/)) {
      this.setState({
        effortMin: e.target.value,
        changed: true
      });
    }
  }

  onChangeEffortMax(e) {
    const effortString = e.target.value;

    if (effortString.match(/^\d*$/)) {
      this.setState({
        effortMax: e.target.value,
        changed: true
      });
    }
  } // resetting the filter


  showOriginalFilter() {
    const {
      location: {
        search
      }
    } = this.props;
    const params = new url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a(search);
    this.setState({
      status: params.get('status') || '',
      effortMin: params.get('effortMin') || '',
      effortMax: params.get('effortMax') || '',
      changed: false
    });
  } //we actually push our query parameters to the URL route here


  applyFilter() {
    const {
      status,
      effortMin,
      effortMax
    } = this.state;
    const {
      history,
      urlBase
    } = this.props;
    const params = new url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a();
    if (status) params.set('status', status);
    if (effortMin) params.set('effortMin', effortMin);
    if (effortMax) params.set('effortMax', effortMax); // dynamically build our query parameters based on what parameters we have

    const search = params.toString() ? `?${params.toString()}` : '';
    history.push({
      pathname: urlBase,
      search
    });
  }

  render() {
    //retrieve the query parameter
    const {
      status,
      effortMin,
      effortMax,
      changed
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Row"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      xs: 6,
      sm: 4,
      md: 3,
      lg: 2
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"], null, "Status:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      componentClass: "select",
      value: status,
      onChange: this.onChangeStatus
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: ""
    }, "(All)"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "New"
    }, "New"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Assigned"
    }, "Assigned"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Fixed"
    }, "Fixed"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("option", {
      value: "Closed"
    }, "Closed")))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      xs: 6,
      sm: 4,
      md: 3,
      lg: 2
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"], null, "Effort between:"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["InputGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      value: effortMin,
      onChange: this.onChangeEffortMin
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["InputGroup"].Addon, null, "-"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormControl"], {
      value: effortMax,
      onChange: this.onChangeEffortMax
    })))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Col"], {
      xs: 6,
      sm: 4,
      md: 3,
      lg: 2
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["FormGroup"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ControlLabel"], null, "\xA0"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["ButtonToolbar"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      bsStyle: "primary",
      type: "button",
      onClick: this.applyFilter
    }, "Apply"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_3__["Button"], {
      type: "button",
      onClick: this.showOriginalFilter,
      disabled: !changed
    }, "Reset")))));
  }

} // need to wrap it with React Router in order to use React Router props


/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["withRouter"])(IssueFilter));

/***/ }),

/***/ "./src/IssueList.jsx":
/*!***************************!*\
  !*** ./src/IssueList.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url_search_params__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url-search-params */ "url-search-params");
/* harmony import */ var url_search_params__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url_search_params__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./graphQLFetch.js */ "./src/graphQLFetch.js");
/* harmony import */ var _IssueTable_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IssueTable.jsx */ "./src/IssueTable.jsx");
/* harmony import */ var _IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./IssueFilter.jsx */ "./src/IssueFilter.jsx");
/* harmony import */ var _IssueDetail_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./IssueDetail.jsx */ "./src/IssueDetail.jsx");
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./store.js */ "./src/store.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var _PageLink_jsx__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./PageLink.jsx */ "./src/PageLink.jsx");









 // for Pagination

const SECTION_SIZE = 5;

class IssueList extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor() {
    super(); // try to retrieve any available data first

    const initialData = _store_js__WEBPACK_IMPORTED_MODULE_7__["default"].initialData || {
      issueList: {}
    };
    const {
      issueList: {
        issues,
        pages
      },
      issue: selectedIssue
    } = initialData;
    delete _store_js__WEBPACK_IMPORTED_MODULE_7__["default"].initialData;
    this.state = {
      issues,
      selectedIssue,
      pages
    };
    this.closeIssue = this.closeIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
  }

  componentDidMount() {
    // load the data if we don't have it yet
    const {
      issues
    } = this.state;
    if (issues == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    // making sure to fetch the data again if there is a change in the query params
    const {
      location: {
        search: prevSearch
      },
      match: {
        params: {
          id: prevId
        }
      }
    } = prevProps;
    const {
      location: {
        search
      },
      match: {
        params: {
          id
        }
      }
    } = this.props;

    if (prevSearch !== search || prevId !== id) {
      this.loadData();
    }
  }

  static async fetchData(match, search, showError) {
    // parse and check if there are any query parameters
    const params = new url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a(search); // variables for IssueDetail, hasSelection and selectedId are required so we need to initialize default values

    const vars = {
      hasSelection: false,
      selectedId: 0
    };
    const {
      params: {
        id
      }
    } = match;
    const idInt = parseInt(id, 10);

    if (!Number.isNaN(idInt)) {
      vars.hasSelection = true;
      vars.selectedId = idInt;
    } // variables for IssueFilter


    if (params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax; // variables for Pagination

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1;
    vars.page = page; // use a second named operation for the query, in case the ID query parameter was passed

    const query = `query issueList(
			$status: StatusType
			$effortMin: Int
			$effortMax: Int
			$hasSelection: Boolean!
			$selectedId: Int!
			$page: Int
			) {
				issueList (
					status: $status
					effortMin: $effortMin
					effortMax: $effortMax
					page: $page
				) { 
					issues {
						id title status owner
						created effort due
					}
					pages
				}
				issue(id: $selectedId) @include (if: $hasSelection) {
					id description
				}
		}`;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, vars, showError);
    return data;
  }

  async loadData() {
    const {
      location: {
        search
      },
      match,
      showError
    } = this.props;
    const data = await IssueList.fetchData(match, search, showError);

    if (data) {
      this.setState({
        issues: data.issueList.issues,
        selectedIssue: data.issue,
        pages: data.issueList.pages
      });
    }
  } // async createIssue(issue) {
  // 	const query = `mutation issueAdd($issue: IssueInputs!) {
  //   		issueAdd(issue: $issue) {
  //     		id
  //   		}
  // 	}`;
  // 	// if adding issue was successful, then refresh data
  // 	const data = await graphQLFetch(query, { issue }, this.showError);
  // 	if (data) {
  // 		this.loadData();
  // 	}
  // }
  // gets triggered by an IssueRow button


  async closeIssue(index) {
    const query = `mutation issueClose($id: Int!) {
            issueUpdate(id: $id, changes: { status: Closed }) {
                id title status owner effort created due description
            }
        }`;
    const {
      issues
    } = this.state; // callbacks for ToastWrapper withToast.jsx

    const {
      showError
    } = this.props;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, {
      id: issues[index].id
    }, showError);

    if (data) {
      // creating a new list and replacing the old item with our new one
      this.setState(prevState => {
        const newList = [...prevState.issues];
        newList[index] = data.issueUpdate;
        return {
          issues: newList
        };
      });
    } else {
      this.loadData();
    }
  }

  async deleteIssue(index) {
    const query = `mutation issueDelete($id: Int!) {
			issueDelete(id: $id)
		  }`;
    const {
      issues
    } = this.state;
    const {
      location: {
        pathname,
        search
      },
      history,
      showError,
      showSuccess
    } = this.props;
    const {
      id
    } = issues[index];
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, {
      id
    }, showError);

    if (data && data.issueDelete) {
      this.setState(prevState => {
        const newList = [...prevState.issues]; // if the user is deleting the selected item, we redirect them back to an unselected view

        if (pathname === `/issues/${id}`) {
          history.push({
            pathname: '/issues',
            search
          });
        }

        newList.splice(index, 1);
        return {
          issues: newList
        };
      }); // we provide user an opportunity to undo the delete

      const undoMessage = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("span", null, `Deleted Issue ${id} successfully. `, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
        bsStyle: "link",
        onClick: () => this.restoreIssue(id)
      }, "UNDO"));
      showSuccess(undoMessage);
    } else {
      //if api call fails, we reload
      this.loadData();
    }
  }

  async restoreIssue(id) {
    const query = `mutation issueRestore($id: Int!) {
			issueRestore(id: $id)
		}`;
    const {
      showSuccess,
      showError
    } = this.props;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, {
      id
    }, showError);

    if (data) {
      showSuccess(`Issue ${id} restored successfully.`);
      this.loadData();
    }
  }

  render() {
    // precheck to ensure we have the data
    const {
      issues
    } = this.state;
    if (issues == null) return null; // using SSR, if a row was selected, this value will exist and the IssueDetail component will render

    const {
      selectedIssue
    } = this.state;
    const {
      match
    } = this.props;
    const {
      location: {
        search
      }
    } = this.props;
    const params = new url_search_params__WEBPACK_IMPORTED_MODULE_1___default.a(search); // START OF PAGINATION CALCULATIONS

    const {
      pages
    } = this.state; // grab the current page, or set it to 1 if it's invalid

    let page = parseInt(params.get('page'), 10);
    if (Number.isNaN(page)) page = 1; // Calculate start and end page
    // sliding window approach, with SECTION_SIZE being the window size

    const startPage = Math.floor((page - 1) / SECTION_SIZE) * SECTION_SIZE + 1;
    const endPage = startPage + SECTION_SIZE - 1; // Calculate previous and next pages

    const prevSection = startPage === 1 ? 0 : startPage - SECTION_SIZE;
    const nextSection = endPage >= pages ? 0 : startPage + SECTION_SIZE; // create our sliding window of Pagination links

    const items = [];

    for (let i = startPage; i <= Math.min(endPage, pages); i += 1) {
      params.set('page', i);
      items.push(react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PageLink_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
        key: i,
        params: params,
        activePage: page,
        page: i
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Pagination"].Item, null, i)));
    } // END OF PAGINATION CALCULATIONS


    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Panel"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Panel"].Heading, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Panel"].Title, {
      toggle: true
    }, "Filter")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Panel"].Body, {
      collapsible: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
      urlBase: "/issues"
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueTable_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], {
      issues: this.state.issues,
      closeIssue: this.closeIssue,
      deleteIssue: this.deleteIssue
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueDetail_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
      issue: selectedIssue
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Pagination"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PageLink_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
      params: params,
      page: prevSection
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Pagination"].Item, null, '<')), items, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_PageLink_jsx__WEBPACK_IMPORTED_MODULE_9__["default"], {
      params: params,
      page: nextSection
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Pagination"].Item, null, '>'))));
  }

} // ToastWrapper hides the static fetchData() function, so we need to add a reference to it to our modified component


const IssueListWithToast = Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_8__["default"])(IssueList);
IssueListWithToast.fetchData = IssueList.fetchData;
/* harmony default export */ __webpack_exports__["default"] = (IssueListWithToast);

/***/ }),

/***/ "./src/IssueReport.jsx":
/*!*****************************!*\
  !*** ./src/IssueReport.jsx ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IssueFilter.jsx */ "./src/IssueFilter.jsx");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./graphQLFetch.js */ "./src/graphQLFetch.js");
/* harmony import */ var _store_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./store.js */ "./src/store.js");






const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];

class IssueReport extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    const stats = _store_js__WEBPACK_IMPORTED_MODULE_5__["default"].initialData ? _store_js__WEBPACK_IMPORTED_MODULE_5__["default"].initialData.issueCounts : null;
    delete _store_js__WEBPACK_IMPORTED_MODULE_5__["default"].initialData;
    this.state = {
      stats
    };
  }

  componentDidMount() {
    const {
      stats
    } = this.state;
    if (stats == null) this.loadData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        search: prevSearch
      }
    } = prevProps;
    const {
      location: {
        search
      }
    } = this.props;
    if (prevSearch != search) this.loadData();
  }

  static async fetchData(match, search, showError) {
    const params = new URLSearchParams(search);
    const vars = {};
    if (params.get('status')) vars.status = params.get('status');
    const effortMin = parseInt(params.get('effortMin'), 10);
    if (!Number.isNaN(effortMin)) vars.effortMin = effortMin;
    const effortMax = parseInt(params.get('effortMax'), 10);
    if (!Number.isNaN(effortMax)) vars.effortMax = effortMax;
    const query = `query issueList(
			$status: StatusType
			$effortMin: Int
			$effortMax: Int
		) {
			issueCounts(
				status: $status
				effortMin: $effortMin
				effortMax: $effortMax
			) {
				owner New Assigned Fixed Closed
			}
		}`;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_4__["default"])(query, vars, showError);
    return data;
  }

  async loadData() {
    const {
      location: {
        search
      },
      match,
      showError
    } = this.props;
    const data = await IssueReport.fetchData(match, search, showError);

    if (data) {
      this.setState({
        stats: data.issueCounts
      });
    }
  }

  render() {
    const {
      stats
    } = this.state;
    if (stats == null) return null;
    const headerColumns = statuses.map(status => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", {
      key: status
    }, status));
    const statRows = stats.map(counts => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", {
      key: counts.owner
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, counts.owner), statuses.map(status => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", {
      key: status
    }, counts[status]))));
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Panel"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Panel"].Heading, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Panel"].Title, {
      toggle: true
    }, "Filter")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Panel"].Body, {
      collapsible: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueFilter_jsx__WEBPACK_IMPORTED_MODULE_2__["default"], {
      urlBase: "/report"
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Table"], {
      bordered: true,
      condensed: true,
      hover: true,
      responsive: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null), headerColumns)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, statRows)));
  }

}

const IssueReportWithToast = Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_3__["default"])(IssueReport);
IssueReportWithToast.fetchData = IssueReport.fetchData;
/* harmony default export */ __webpack_exports__["default"] = (IssueReportWithToast);

/***/ }),

/***/ "./src/IssueTable.jsx":
/*!****************************!*\
  !*** ./src/IssueTable.jsx ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return IssueTable; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _UserContext_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./UserContext.js */ "./src/UserContext.js");




 // wrapping in React Router component so we can access Router props

class IssueRowPlain extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  render() {
    const {
      issue,
      location: {
        search
      },
      closeIssue,
      deleteIssue,
      index
    } = this.props; // for use with Authorization feature

    const user = this.context;
    const disabled = !user.signedIn; // appending the id to the path

    const selectLocation = {
      pathname: `/issues/${issue.id}`,
      search
    };
    const editTooltip = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], {
      id: "close-tooltip",
      placement: "top"
    }, "Edit Issue");
    const closeTooltip = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], {
      id: "close-tooltip",
      placement: "top"
    }, "Close Issue");
    const deleteTooltip = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Tooltip"], {
      id: "delete-tooltip",
      placement: "top"
    }, "Delete Issue"); // needed so that the row isn't selected when we click the buttons in the row

    function onClose(e) {
      e.preventDefault();
      closeIssue(index);
    }

    function onDelete(e) {
      e.preventDefault();
      deleteIssue(index);
    }

    const tableRow = react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.id), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.status), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.owner), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.created.toDateString()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.effort), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.due ? issue.due.toDateString() : ''), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, issue.title), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("td", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
      to: `/edit/${issue.id}`
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      delayShow: 1000,
      overlay: editTooltip
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      bsSize: "xsmall"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Glyphicon"], {
      glyph: "edit"
    })))), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      delayShow: 1000,
      overlay: closeTooltip
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      bsSize: "xsmall",
      onClick: onClose,
      disabled: disabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Glyphicon"], {
      glyph: "remove"
    }))), ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["OverlayTrigger"], {
      delayShow: 1000,
      overlay: deleteTooltip
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Button"], {
      bsSize: "xsmall",
      onClick: onDelete,
      disabled: disabled
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Glyphicon"], {
      glyph: "trash"
    })))));
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_3__["LinkContainer"], {
      to: selectLocation
    }, tableRow);
  }

} // specify the Context object, for use with Authorization feature


IssueRowPlain.contextType = _UserContext_js__WEBPACK_IMPORTED_MODULE_4__["default"];
const IssueRow = Object(react_router_dom__WEBPACK_IMPORTED_MODULE_1__["withRouter"])(IssueRowPlain); // need to delete the wrapped component's contextType or it will cause error

delete IssueRow.contextType;
function IssueTable({
  issues,
  closeIssue,
  deleteIssue
}) {
  //retrieve the parent's callback and pass it to the row component
  const issueRows = issues.map((issue, index) => react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(IssueRow, {
    key: issue.id,
    issue: issue,
    closeIssue: closeIssue,
    deleteIssue: deleteIssue,
    index: index
  }));
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_2__["Table"], {
    className: "bordered-table",
    bordered: true,
    condensed: true,
    hover: true,
    responsive: true
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("thead", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tr", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "ID"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Status"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Owner"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Created"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Effort"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Due Date"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Title"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("th", null, "Action"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("tbody", null, issueRows));
}

/***/ }),

/***/ "./src/NotFound.jsx":
/*!**************************!*\
  !*** ./src/NotFound.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function NotFound() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("h1", null, "Page Not Found");
}

/* harmony default export */ __webpack_exports__["default"] = (NotFound);

/***/ }),

/***/ "./src/NumInput.jsx":
/*!**************************!*\
  !*** ./src/NumInput.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return NumInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Specialized Input Component for Forms
 // convert numeric to string

function format(num) {
  return num != null ? num.toString() : '';
} // convert string back to integer, or return null


function unformat(str) {
  const val = parseInt(str, 10);
  return Number.isNaN(val) ? null : val;
}

class NumInput extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: format(props.value)
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  } // check to see if the input value is a valid digit


  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({
        value: e.target.value
      });
    }
  } // call the parent's onChange method when input loses focus


  onBlur(e) {
    const {
      onChange
    } = this.props;
    const {
      value
    } = this.state; // exporting the value as integer to the parent

    onChange(e, unformat(value));
  }

  render() {
    const {
      value
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("input", _extends({
      type: "text" // copy any other properties that the parent may have supplied

    }, this.props, {
      value: value,
      onBlur: this.onBlur,
      onChange: this.onChange
    }));
  }

}

/***/ }),

/***/ "./src/Page.jsx":
/*!**********************!*\
  !*** ./src/Page.jsx ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Page; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _Contents_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Contents.jsx */ "./src/Contents.jsx");
/* harmony import */ var _IssueAddNavItem_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IssueAddNavItem.jsx */ "./src/IssueAddNavItem.jsx");
/* harmony import */ var _Search_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Search.jsx */ "./src/Search.jsx");
/* harmony import */ var _SignInNavItem_jsx__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SignInNavItem.jsx */ "./src/SignInNavItem.jsx");
/* harmony import */ var _UserContext_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./UserContext.js */ "./src/UserContext.js");
/* harmony import */ var _server_render_jsx__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../server/render.jsx */ "./server/render.jsx");








 // create a simple navbar that links to our routes

function NavBar({
  user,
  onUserChange
}) {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"], {
    fluid: true,
    collapseOnSelect: true
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"].Header, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"].Brand, null, "Issue Tracker"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"].Toggle, null)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"].Collapse, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"], null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__["LinkContainer"], {
    exact: true,
    to: "/"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavItem"], null, "Home")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__["LinkContainer"], {
    to: "/issues"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavItem"], null, "Issue List")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__["LinkContainer"], {
    to: "/report"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavItem"], null, "Report"))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Col"], {
    sm: 5
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Navbar"].Form, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Search_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], null))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Nav"], {
    pullRight: true
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_IssueAddNavItem_jsx__WEBPACK_IMPORTED_MODULE_4__["default"], null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_SignInNavItem_jsx__WEBPACK_IMPORTED_MODULE_6__["default"], {
    user: user,
    onUserChange: onUserChange
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavDropdown"], {
    id: "user-dropdown",
    title: react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Glyphicon"], {
      glyph: "option-vertical"
    }),
    noCaret: true
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_2__["LinkContainer"], {
    to: "/about"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["MenuItem"], null, "About"))))));
}

function Footer() {
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("small", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("p", {
    className: "text-center"
  }, "Full source code available at this", ' ', react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("a", {
    href: "https://github.com/TriDangContact/IssueTracker-WebApp"
  }, "GitHub repository")));
}

class Page extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        signedIn: false,
        givenName: ''
      }
    };
    this.onUserChange = this.onUserChange.bind(this);
  }

  async componentDidMount() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST',
      credentials: 'include'
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const {
      signedIn,
      givenName
    } = result;
    this.setState({
      user: {
        signedIn,
        givenName
      }
    });
  }

  onUserChange(user) {
    this.setState({
      user
    });
  }

  render() {
    const {
      user
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(NavBar, {
      user: user,
      onUserChange: this.onUserChange
    }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Grid"], {
      fluid: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_UserContext_js__WEBPACK_IMPORTED_MODULE_7__["default"].Provider, {
      value: user
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Contents_jsx__WEBPACK_IMPORTED_MODULE_3__["default"], null))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("hr", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Footer, null));
  }

}

/***/ }),

/***/ "./src/PageLink.jsx":
/*!**************************!*\
  !*** ./src/PageLink.jsx ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return PageLink; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-router-bootstrap */ "react-router-bootstrap");
/* harmony import */ var react_router_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_1__);

 // component for pagination

function PageLink({
  params,
  page,
  activePage,
  children
}) {
  params.set('page', page);
  if (page == 0) return react__WEBPACK_IMPORTED_MODULE_0___default.a.cloneElement(children, {
    disabled: true
  });
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_bootstrap__WEBPACK_IMPORTED_MODULE_1__["LinkContainer"], {
    isActive: () => page === activePage,
    to: {
      search: `?${params.toString()}`
    }
  }, children);
}

/***/ }),

/***/ "./src/Search.jsx":
/*!************************!*\
  !*** ./src/Search.jsx ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_select_lib_Async__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-select/lib/Async */ "react-select/lib/Async");
/* harmony import */ var react_select_lib_Async__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_select_lib_Async__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react-router-dom */ "react-router-dom");
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_router_dom__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./graphQLFetch.js */ "./src/graphQLFetch.js");
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");






class Search extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({
    value
  }) {
    const {
      history
    } = this.props;
    history.push(`/edit/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query issueList($search: String) {
            issueList(search: $search) {
                issues { id title }
            }
        }`;
    const {
      showError
    } = this.props;
    const data = await Object(_graphQLFetch_js__WEBPACK_IMPORTED_MODULE_3__["default"])(query, {
      search: term
    }, showError); // create an array of options object from the issues, with each option containing a label and value

    return data.issueList.issues.map(issue => ({
      label: `#${issue.id}: ${issue.title}`,
      value: issue.id
    }));
  }

  render() {
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_select_lib_Async__WEBPACK_IMPORTED_MODULE_1___default.a, {
      instanceId: "search-select",
      value: "",
      loadOptions: this.loadOptions,
      filterOption: () => true,
      onChange: this.onChangeSelection,
      components: {
        DropdownIndicator: null
      }
    });
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["withRouter"])(Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_4__["default"])(Search)));

/***/ }),

/***/ "./src/SignInNavItem.jsx":
/*!*******************************!*\
  !*** ./src/SignInNavItem.jsx ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _withToast_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./withToast.jsx */ "./src/withToast.jsx");
/* harmony import */ var _UserContext_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./UserContext.js */ "./src/UserContext.js");





class SignInNavItem extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      showing: false,
      disabledGoogleAuth: true
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.signOut = this.signOut.bind(this);
    this.signIn = this.signIn.bind(this);
  }

  async componentDidMount() {
    // load the Google API Library
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    if (!clientId) return;
    window.gapi.load('auth2', () => {
      if (!window.gapi.auth2.getAuthInstance()) {
        window.gapi.auth2.init({
          client_id: clientId
        }).then(() => {
          this.setState({
            disabledGoogleAuth: false
          });
        });
      }
    });
    await this.loadData();
  }

  showModal() {
    // initial attempt to retrieve the Google Client ID
    const clientId = window.ENV.GOOGLE_CLIENT_ID;
    const {
      showError
    } = this.props;

    if (!clientId) {
      showError('Missing environment variable GOOGLE_CLIENT_ID');
      return;
    }

    this.setState({
      showing: true
    });
  }

  hideModal() {
    this.setState({
      showing: false
    });
  }

  async signOut() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const {
      showError
    } = this.props;

    try {
      // API call to clear cookie on the back-end server
      await fetch(`${apiEndpoint}/signout`, {
        method: 'POST',
        credentials: 'include'
      }); // sign out of the Google Authentication session

      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut(); // call back from Page.jsx, so that it can update its state and context value, and re-renders the page

      const {
        onUserChange
      } = this.props;
      onUserChange({
        signedIn: false,
        givenName: ''
      });
    } catch (error) {
      showError(`Error signing out: ${error}`);
    }
  }

  async signIn() {
    this.hideModal();
    const {
      showError
    } = this.props;
    let googleToken; // we use Google API's Authentication library to retrieve the token

    try {
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      googleToken = googleUser.getAuthResponse().id_token;
    } catch (error) {
      showError(`Error authenticating with Google: ${error.error}`);
    } // send the token to our back-end Authentication API so that it can be verified


    try {
      const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
      const response = await fetch(`${apiEndpoint}/signin`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          google_token: googleToken
        })
      });
      const body = await response.text();
      const result = JSON.parse(body);
      const {
        signedIn,
        givenName,
        picture
      } = result; // call back from Page.jsx, so that it can update its state and context value, and re-renders the page

      const {
        onUserChange
      } = this.props;
      onUserChange({
        signedIn,
        givenName
      });
    } catch (error) {
      showError(`Error signing into the app: ${error}`);
    }
  } // called on browser refresh to retrieve credentials from back-end persistent session


  async loadData() {
    const apiEndpoint = window.ENV.UI_AUTH_ENDPOINT;
    const response = await fetch(`${apiEndpoint}/user`, {
      method: 'POST'
    });
    const body = await response.text();
    const result = JSON.parse(body);
    const {
      signedIn,
      givenName,
      picture
    } = result;
    this.setState({
      user: {
        signedIn,
        givenName,
        picture
      }
    });
  }

  render() {
    const {
      user
    } = this.props; // const picture = (
    // 	<Image src={user.picture} responsive circle id="profile_pic" />
    // );

    if (user.signedIn) {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavDropdown"], {
        title: user.givenName,
        id: "user"
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["MenuItem"], {
        onClick: this.signOut
      }, "Sign Out"));
    }

    const {
      showing,
      disabledGoogleAuth
    } = this.state;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["NavItem"], {
      onClick: this.showModal
    }, "Sign In"), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"], {
      keyboard: true,
      show: showing,
      onHide: this.hideModal,
      bsSize: "sm"
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Header, {
      closeButton: true
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Title, null, "Sign In")), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Body, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      block: true,
      disabled: disabledGoogleAuth,
      bsStyle: "primary",
      onClick: this.signIn
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("img", {
      src: "https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png",
      alt: "Sign in with Google"
    }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Modal"].Footer, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Button"], {
      bsStyle: "link",
      onClick: this.hideModal
    }, "Cancel"))));
  }

}

/* harmony default export */ __webpack_exports__["default"] = (Object(_withToast_jsx__WEBPACK_IMPORTED_MODULE_2__["default"])(SignInNavItem));

/***/ }),

/***/ "./src/TextInput.jsx":
/*!***************************!*\
  !*** ./src/TextInput.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TextInput; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function format(text) {
  return text != null ? text : '';
}

function unformat(text) {
  return text.trim().length === 0 ? null : text;
}

class TextInput extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: format(props.value)
    };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({
      value: e.target.value
    });
  } // call the parent callback and pass back the Natural Data type


  onBlur(e) {
    const {
      onChange
    } = this.props;
    const {
      value
    } = this.state;
    onChange(e, unformat(value));
  }

  render() {
    const {
      value
    } = this.state; // get the desired input element (or default to input if not passed), and any other passed in props

    const {
      tag = 'input',
      ...props
    } = this.props; // programmatically create the input component

    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(tag, { ...props,
      value,
      onBlur: this.onBlur,
      onChange: this.onChange
    });
  }

}

/***/ }),

/***/ "./src/Toast.jsx":
/*!***********************!*\
  !*** ./src/Toast.jsx ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Toast; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-bootstrap */ "react-bootstrap");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__);


class Toast extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
  componentDidUpdate() {
    const {
      showing,
      onDismiss
    } = this.props;

    if (showing) {
      clearTimeout(this.dismissTimer);
      this.dismissTimer = setTimeout(onDismiss, 5000);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.dismissTimer);
  }

  render() {
    const {
      showing,
      bsStyle,
      onDismiss,
      children
    } = this.props;
    return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Collapse"], {
      in: showing
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
      style: {
        position: 'fixed',
        bottom: 20,
        left: 20,
        zIndex: 10
      }
    }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_1__["Alert"], {
      bsStyle: bsStyle,
      onDismiss: onDismiss
    }, children)));
  }

}

/***/ }),

/***/ "./src/UserContext.js":
/*!****************************!*\
  !*** ./src/UserContext.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
// using React Context to share global data to other components, instead of lifting up a state
// This Context is used to keep track of sign in status for Authorization feature

const UserContext = react__WEBPACK_IMPORTED_MODULE_0___default.a.createContext({
  signedIn: false,
  givenName: ''
});
/* harmony default export */ __webpack_exports__["default"] = (UserContext);

/***/ }),

/***/ "./src/graphQLFetch.js":
/*!*****************************!*\
  !*** ./src/graphQLFetch.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return graphQLFetch; });
/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! isomorphic-fetch */ "isomorphic-fetch");
/* harmony import */ var isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);


dotenv__WEBPACK_IMPORTED_MODULE_1___default.a.config();
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
} // generic function that helps us handle errors from API calls


async function graphQLFetch(query, variables = {}, showError = null) {
  // check if we're calling in browser rendered or server rendered mode
  const apiEndpoint =  false // eslint-disable-line no-undef
  ? undefined : process.env.UI_SERVER_API_ENDPOINT;

  try {
    const response = await isomorphic_fetch__WEBPACK_IMPORTED_MODULE_0___default()(apiEndpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n '); // alert(`${error.message}:\n ${details}`);

        if (showError) {
          showError(`${error.message}:\n${details}`);
        }
      } else if (showError) {
        showError(`${error.extensions.code}:${error.message}`); // alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    if (showError) {
      showError(`Error in sending data to server: ${e.message}`);
      return null;
    }

    alert(`Error in sending data to server: ${e.message}`);
  }
}

/***/ }),

/***/ "./src/routes.js":
/*!***********************!*\
  !*** ./src/routes.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IssueList_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IssueList.jsx */ "./src/IssueList.jsx");
/* harmony import */ var _IssueReport_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IssueReport.jsx */ "./src/IssueReport.jsx");
/* harmony import */ var _IssueEdit_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IssueEdit.jsx */ "./src/IssueEdit.jsx");
/* harmony import */ var _About_jsx__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./About.jsx */ "./src/About.jsx");
/* harmony import */ var _NotFound_jsx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NotFound.jsx */ "./src/NotFound.jsx");
// used for generic generating of Routes from URL paths





const routes = [// optional parameter for IssueList
{
  path: '/issues/:id?',
  component: _IssueList_jsx__WEBPACK_IMPORTED_MODULE_0__["default"]
}, {
  path: '/edit/:id',
  component: _IssueEdit_jsx__WEBPACK_IMPORTED_MODULE_2__["default"]
}, {
  path: '/report',
  component: _IssueReport_jsx__WEBPACK_IMPORTED_MODULE_1__["default"]
}, {
  path: '/about',
  component: _About_jsx__WEBPACK_IMPORTED_MODULE_3__["default"]
}, {
  path: '*',
  component: _NotFound_jsx__WEBPACK_IMPORTED_MODULE_4__["default"]
}];
/* harmony default export */ __webpack_exports__["default"] = (routes);

/***/ }),

/***/ "./src/store.js":
/*!**********************!*\
  !*** ./src/store.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const store = {};
/* harmony default export */ __webpack_exports__["default"] = (store);

/***/ }),

/***/ "./src/withToast.jsx":
/*!***************************!*\
  !*** ./src/withToast.jsx ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return withToast; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Toast_jsx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Toast.jsx */ "./src/Toast.jsx");
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }



function withToast(OriginalComponent) {
  return class ToastWrapper extends react__WEBPACK_IMPORTED_MODULE_0___default.a.Component {
    constructor(props) {
      super(props);
      this.state = {
        toastVisible: false,
        toastMessage: '',
        toastType: 'success'
      };
      this.showSuccess = this.showSuccess.bind(this);
      this.showError = this.showError.bind(this);
      this.dismissToast = this.dismissToast.bind(this);
    }

    showSuccess(message) {
      this.setState({
        toastVisible: true,
        toastMessage: message,
        toastType: 'success'
      });
    }

    showError(message) {
      this.setState({
        toastVisible: true,
        toastMessage: message,
        toastType: 'danger'
      });
    }

    dismissToast() {
      this.setState({
        toastVisibility: false
      });
    }

    render() {
      const {
        toastType,
        toastVisible,
        toastMessage
      } = this.state;
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_0___default.a.Fragment, null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(OriginalComponent, _extends({
        showError: this.showError,
        showSuccess: this.showSuccess,
        dismissToast: this.dismissToast
      }, this.props)), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Toast_jsx__WEBPACK_IMPORTED_MODULE_1__["default"], {
        bsStyle: toastType,
        showing: toastVisible,
        onDismiss: this.dismissToast
      }, toastMessage));
    }

  };
}

/***/ }),

/***/ "./webpack.config.js":
/*!***************************!*\
  !*** ./webpack.config.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const path = __webpack_require__(/*! path */ "path");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");

const browserConfig = {
  mode: 'development',
  entry: {
    app: ['./browser/App.jsx']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: {
              ie: '11',
              edge: '15',
              safari: '10',
              firefox: '50',
              chrome: '49'
            }
          }], '@babel/preset-react'],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }]
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  },
  plugins: [new webpack.DefinePlugin({
    __isBrowser__: 'true'
  })],
  node: {
    fs: 'empty'
  },
  devtool: 'source-map'
};
const serverConfig = {
  mode: 'development',
  entry: {
    server: ['./server/uiserver.js']
  },
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: {
              node: '10'
            }
          }], '@babel/preset-react']
        }
      }
    }]
  },
  plugins: [new webpack.DefinePlugin({
    __isBrowser__: 'false'
  })],
  node: {
    fs: 'empty'
  },
  devtool: 'source-map'
};
module.exports = [browserConfig, serverConfig];
/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ 0:
/*!***********************************************************************!*\
  !*** multi ./server/uiserver.js ./node_modules/webpack/hot/poll?1000 ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ./server/uiserver.js */"./server/uiserver.js");
module.exports = __webpack_require__(/*! ./node_modules/webpack/hot/poll?1000 */"./node_modules/webpack/hot/poll.js?1000");


/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http-proxy-middleware":
/*!****************************************!*\
  !*** external "http-proxy-middleware" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http-proxy-middleware");

/***/ }),

/***/ "isomorphic-fetch":
/*!***********************************!*\
  !*** external "isomorphic-fetch" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),

/***/ "react-bootstrap":
/*!**********************************!*\
  !*** external "react-bootstrap" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-bootstrap");

/***/ }),

/***/ "react-dom/server":
/*!***********************************!*\
  !*** external "react-dom/server" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),

/***/ "react-router-bootstrap":
/*!*****************************************!*\
  !*** external "react-router-bootstrap" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-bootstrap");

/***/ }),

/***/ "react-router-dom":
/*!***********************************!*\
  !*** external "react-router-dom" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-router-dom");

/***/ }),

/***/ "react-select/lib/Async":
/*!*****************************************!*\
  !*** external "react-select/lib/Async" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("react-select/lib/Async");

/***/ }),

/***/ "serialize-javascript":
/*!***************************************!*\
  !*** external "serialize-javascript" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("serialize-javascript");

/***/ }),

/***/ "source-map-support":
/*!*************************************!*\
  !*** external "source-map-support" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("source-map-support");

/***/ }),

/***/ "url-search-params":
/*!************************************!*\
  !*** external "url-search-params" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("url-search-params");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-dev-middleware");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-hot-middleware");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map