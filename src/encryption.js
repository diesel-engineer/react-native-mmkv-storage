import { initialize, currentInstancesStatus } from "./initializer";
import generatePassword from "./keygen";
import { stringToHex } from "./utils";
import { handleActionAsync } from "react-native-mmkv-storage/src/handlers";

function encryptStorage(
  options,
  key,
  alias,
  accessibleMode,
  callback
) {
    options.mmkv
      .encrypt(options.instanceID, key, null)
      .then((r) => {
        callback(null, r);
      })
      .catch((e) => {
        callback(e, null);
      });
}

export default class encryption {
  constructor(args) {
    this.MMKV = args.mmkv;
    this.instanceID = args.instanceID;
    this.alias = args.alias;
    this.aliasPrefix = args.aliasPrefix;
    this.key = args.key;
    this.accessibleMode = args.accessibleMode;
    this.initialized = args.initialized;
    this.options = args;
  }

  async encrypt(key, alias, accessibleMode) {
    if (accessibleMode) {
      this.accessibleMode = accessibleMode;
    }

    this.alias = stringToHex(this.aliasPrefix + this.instanceID);
    if (key) {
      this.key = key;
    } else {
      this.key = generatePassword();
    }

    return new Promise((resolve, reject) => {
      if (currentInstancesStatus[this.instanceID]) {
        encryptStorage(
          this.options,
          this.key,
          this.alias,
          this.accessibleMode,
          (e, r) => {
            if (e) {
              reject(e);
            }
            resolve(r);
          }
        );
      } else {
        initialize(this.options, (e) => {
          if (e) {
            return;
          }
          currentInstancesStatus[this.instanceID] = true;
          encryptStorage(
            this.options,
            this.key,
            this.alias,
            this.accessibleMode,
            (e, r) => {
              if (e) {
                reject(e);
              }
              resolve(r);
            }
          );
        });
      }
    });
  }

  async decrypt() {
    return await handleActionAsync(
      this.options,
      this.MMKV.decrypt,
      this.instanceID
    );
  }

  async changeEncryptionKey(
    key,
    alias,
    accessibleMode
  ) {
    if (accessibleMode) {
      this.accessibleMode = accessibleMode;
    }
    this.alias = stringToHex(this.aliasPrefix + this.instanceID);
    if (key) {
      this.key = key;
    } else {
      this.key = generatePassword();
    }

    return new Promise(async (resolve, reject) => {
      if (currentInstancesStatus[this.instanceID]) {
        encryptStorage(
          this.options,
          this.key,
          this.alias,
          this.accessibleMode,
          (e, r) => {
            if (e) {
              reject(e);
            }
            resolve(r);
          }
        );
      } else {
        initialize(this.options, (e) => {
          if (e) {
            return;
          }
          currentInstancesStatus[this.instanceID] = true;
          encryptStorage(
            this.options,
            this.key,
            this.alias,
            this.accessibleMode,
            (e, r) => {
              if (e) {
                reject(e);
              }
              resolve(r);
            }
          );
        });
      }
    });
  }
}
