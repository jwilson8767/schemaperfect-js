import {jest, describe, expect, test} from '@jest/globals'
import {SchemaBase, SchemaValidationError} from "../src/schemaperfect";

test('test_schemabase',async ()=>{
    class A extends SchemaBase{
        get _property_names(){
             return ['b','c']
         }
        get _schema(){
             return {
                 type: "object",
                 properties: {
                     "b":{
                         type:"string"
                     }
                 }
             }
         }

        constructor(b=1,c=2,d=3) {
            super({b, c, d});
        }

        child_function(x){
             return x
        }

    }
    const a = new A();
    expect(a.b).toEqual(1)
    expect(a.c).toEqual(2)
    expect(a.d).toEqual(3)

    a.b = 2
    expect(a.b).toEqual(2)

    expect(a.to_dict()).toEqual({b:2,c:2,d:3})

    expect(()=>{a.to_dict({validate:true})}).toThrowError(SchemaValidationError);

    a.b = "2"

    expect(()=>{a.to_dict({validate:true})})

    expect(a.child_function(1)).toEqual(1)
})



test('test_schemabase_valid_at_instantiation',async ()=>{
    class A extends SchemaBase{
        get _class_is_valid_at_instantiation(){
            return true
        }
        get _property_names(){
            return ['b','c']
        }
        get _schema(){
            return {
                type: "object",
                properties: {
                    "b":{
                        type:"string"
                    }
                }

            }
        }

        constructor(b=1,c=2,d=3) {
            super({b, c, d});
        }

        child_function(x){
            return x
        }

    }


    expect(()=>{ new A()}).toThrowError(SchemaValidationError);
    expect( (new A("1",2,3)).b).toEqual("1");
    class B extends A{

    }
    // if this fail something is weird about static getter inheritance
    expect( (new B("1",2,3)).b).toEqual("1");
})
