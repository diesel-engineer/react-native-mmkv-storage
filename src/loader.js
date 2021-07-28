import { NativeModules } from "react-native";
import generatePassword from "./keygen";
import API from "./api";
import { stringToHex, ACCESSIBLE, MODES } from "./utils";
import { currentInstancesStatus } from "./initializer";

export default class Loader {
  constructor() {
    this.instanceID = "default";
    this.initWithEncryption = false;
    this.accessibleMode = ACCESSIBLE.WHEN_UNLOCKED;
    this.processingMode = MODES.SINGLE_PROCESS;
    this.aliasPrefix = "com.MMKV.";
    this.alias = null;
    this.key = null;
    this.mmkv = NativeModules.MMKVStorage;
    this.initialized = false;
    this.error = null;
  }

  withInstanceID(id) {
    this.instanceID = id;

    return this;
  }

  withEncryption() {
    this.initWithEncryption = true;
    this.key = generatePassword();
    this.alias = stringToHex(this.aliasPrefix + this.instanceID);
    return this;
  }

  setAccessibleIOS(accessible) {
    this.accessibleMode = accessible;
    return this;
  }

  encryptWithCustomKey(key, alias) {
    this.key = key;
    return this;
  }

  setProcessingMode(mode) {
    this.processingMode = mode;

    return this;
  }

  initialize() {
    currentInstancesStatus[this.instanceID] = false;
    return this.getInstance();
  }

  generateKey() {
    this.key = generatePassword();

    return this;
  }

  getInstance() {
    if (this.error) {
      throw new Error(this.error);
    }
    let options = this;

    let instance = new API(options);

    return instance;
  }
}
