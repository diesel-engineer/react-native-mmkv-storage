export const currentInstancesStatus = {};

/**
 *
 * Initialize function is used to create
 * the storage or load the storage if
 * it already exists with the given options.
 *
 * @param {*} options
 * @param {Function} callback
 */

export function initialize(options, callback) {
  if (options.initWithEncryption) {
      initWithEncryptionWithoutSecureStorage(options, callback);
  } else {
    initWithoutEncryption(options, callback);
  }
}

/**
 * It is possible that the user does not
 * want to store the key in secure storage.
 * In such a case, this function will
 * be called to encrypt the storage.
 *
 * @param {*} options The options you have set for storage in loader class
 * @param {Function} callback A function called with two params, error & result
 */

function initWithEncryptionWithoutSecureStorage(options, callback) {
  if (options.key == null || options.key.length < 3)
    throw new Error("Key is null or too short");

  options.mmkv.setupWithEncryption(
    options.instanceID,
    options.processingMode,
    options.key,
    options.alias,
    (error) => {
      if (error) {
        callback(error, null);
        return;
      }
      callback(null, true);
    }
  );
}

/**
 *
 * When you want to initializ the storage
 * without encryption this function is called.
 *
 * @param {*} options The options you have set for storage in loader class
 * @param {Function} callback A function called with two params, error & result
 */

function initWithoutEncryption(options, callback) {
  options.mmkv.setup(
    options.instanceID,
    options.processingMode,
    (error) => {
      if (error) {
        callback(error, null);
      }

      callback(null, true);
    }
  );
}
