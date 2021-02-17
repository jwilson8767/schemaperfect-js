#!/usr/bin/env node
import {ValidationError, validate, } from 'jsonschema';
import clone from 'lodash-es/clone';
import cloneDeep from 'lodash-es/cloneDeep';
let ENABLE_VALIDATION_AT_INSTANTIATION = true;

/**
 * Global enable/disable validation at instantiation
 *
 * @param {boolean} value
 */
export function set_valid_at_instantiation(value = true) {
    ENABLE_VALIDATION_AT_INSTANTIATION = value
}

export class SchemaValidationError extends Error {

    constructor(message, error) {
        super(message);
        this.error = error
    }
}

/**
 * @property {object} _schema
 * @property {object} _rootschema
 * @property {String[]} _property_names
 * @property {boolean} _class_is_valid_at_instantiation
 * @property {array|null} _args
 * @property {object|null} _kwargs
 */
export class SchemaBase {
    constructor(...args) {
        if (!this._schema) {
            throw new Error(`Cannot instantiate object of type ${this.constructor.name}: _schema attribute is not defined`)
        }
        this._args = null;
        this._kwargs = null;
        if (args.length === 0) {

        } else if (args.length === 1 && typeof args[0] === "object") {
            this._kwargs = args[0]
        } else {
            this._args = args[0]
        }
        if (!this._property_names) {
            if (!this._kwargs) {
                this._property_names = null;
            } else {
                this._property_names = Object.keys(this._kwargs)
            }

        }
        // if (this._property_names !== null) {
        //     for (const k of this._property_names) {
        //         if (!(k in this)){ // skip defining parameters which are already defined on the object
        //             Object.defineProperty(this, k,{configurable:true,  get:  this._get_property.bind(this, k), set:this._set_property.bind(this, k)})
        //         }
        //     }
        // }
        this._model_proxy = new Proxy(this, {
            get(target, p, receiver) {
                return target._get_property(p);
            },
            set(target, p, value, receiver) {
                return target._set_property(p, value);
            }
        });
        if (ENABLE_VALIDATION_AT_INSTANTIATION && this._class_is_valid_at_instantiation) {
            this.to_dict({validate: true});
        }
        return this._model_proxy;

    }

    _get_property(k){
        if(k in this){
            return this[k]
        }
        if(k in this._kwargs){
            return this._kwargs[k]
        }
        return undefined
    }
    _set_property(k, value){
        if (k in this) { // use setters if property is already defined
            this[k] = value
        }
        // assign to _kwargs if this is in any way a dict
        else if (this._property_names !== null && this._kwargs !== null) {
            this._kwargs[k] = value;
        }
        // _args can't be modified after creation, skip this case
        // else if(this._args !== null) {}
        else {
            Object.defineProperty(this, k, {value, configurable: true, writable: true});
        }

        return true
    }

    valueOf(){
        if (this._args !== null){
            return this._args
        }else{
            return this._kwargs
        }
    }

    /**
     * Get the object data as native types, optionally enforcing validation.
     *
     * @param {boolean} validate
     */
    to_dict({validate = false} = {}) {
        const _to_dict = (obj)=>{
            if(obj instanceof SchemaBase){
                return obj.to_dict({validate})
            }
            if (Array.isArray(obj)){
                return obj.map((v)=>_to_dict(v))

            }
            if (obj instanceof Set){
                let _set = Array.from(obj.values())
                _set.sort()
                return _set
            }
            if (typeof obj === "string"){
                return obj
            }
            if (obj instanceof Map || typeof obj === "object"){
                // recurse Maps / objects
                return Object.fromEntries(Object.entries(obj).map(([k,v])=>[k,_to_dict(v)]))
            }
            return obj
        }
        let result
        if (!!this._args && !!this._kwargs){
            throw new Error(`${this.constructor.name} instance has both a value and properties : cannot serialize to dict`)
        }

        if (this._args){
            result = _to_dict(this._args)
        }
        else{
            result = _to_dict(this._kwargs)
        }
        if (validate){
            try{
                this.validate(result)
            } catch(e){
              throw new SchemaValidationError(`Failed to validate ${this.constructor.name} instance: ${e.message}`, e)
            }
        }
        return result
    }

    /**
     * Get the object data as a json string, optionally enforcing validation
     * @param validate
     */
    to_json({validate=true}={}){
        const result = this.to_dict({validate})
        return JSON.stringify(result)
    }

    // static from_dict(obj){
    //     return new this()
    // }
    //
    // static from_json(){}

    /**
     *
     * @param {boolean} deep Whether to recursively clone or not.
     * @param {string[]|null} exclude keys to exclude
     */
    copy({deep = true, exclude = null} = {}) {
        return deep? cloneDeep(this): clone(this);
    }


    validate(data=null){
        if (data === null){
            return this.to_dict({validate:true})
        }
        return validate(data, this._schema,{throwFirst:true})
    }
}

