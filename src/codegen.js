
'use strict';
import get from 'lodash-es/get.js';
import uniq from 'lodash-es/uniq.js';
import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';
import {fileURLToPath} from "url";
import refParser from "@apidevtools/json-schema-ref-parser";
import yargs from 'yargs';
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export async function main() {
    const args = yargs(process.argv.slice(2))
        .positional('file',{
            describe: 'The JSON schema to generate classes from',
            type: 'string'})
        .string('outdir',{describe:''})
        .boolean('individual')
        .string('lib_path', {})

    const [file, outdir, separate, lib_path ] = process.argv.slice(2);

    return await generate_classes_from_file({file, outdir, separate, lib_path})
}

export async function generate_classes_from_file({file = null, outdir = null, separate = false, lib_path = "schemaperfect"}) {
    let schema = JSON.parse(await readFile(file));
    schema = await refParser.dereference(schema);
    let classes = await Promise.all(Object.entries(schema['definitions']).filter(([_, definition_schema]) => !!get(definition_schema, 'type')).map(([class_id, class_schema]) => generate_class({
        class_id,
        class_schema,
        outfile: separate ? path.join(outdir, class_id + '.js') : null,
        lib_path
    })));
    if (!separate) {
        const outfile = path.join(outdir, path.basename(file).split('.')[0].toLowerCase().replace(/ /g, '_') + '_classes.js')
        await writeFile(outfile, `'use strict';\nimport {SchemaBase} from "${lib_path}";\n${classes.join('\n\n')}`);
        console.log(`Generated "${outfile}".`)
    }
}


export async function generate_class({class_id, class_schema, outfile = null, lib_path = "schemaperfect"}) {
    let result = `
        /** ${get(class_schema, 'title', '')}${get(class_schema, 'description') ? `\n${get(class_schema, 'description')}\n` : ''}
        ${Object.entries(get(class_schema, 'properties', {})).map(([k, v]) => `* @property {${get_jsdoc_type(v)}} ${k} ${get(v, 'description')}`).join('\n')}
        */
        export class ${class_id} extends SchemaBase {
          get _schema(){
            if(!this.__schema){
                this.__schema =  JSON.parse(\`${JSON.stringify(class_schema)}\`)
            }
            return this.__schema
          }
            
          get _property_names(){
            return [${Object.keys(get(class_schema, 'properties', {})).map(a => '"' + a + '"').join(', ')}]
          }
          
          constructor({${Object.entries(get(class_schema, 'properties', {})).map(([k, v]) => `${k}=${get(v, 'default') ? '\"' + get(v, 'default') + '"' : 'null'}`).join(', ')}}){
            super({${Object.keys(get(class_schema, 'properties', {})).join(', ')}})
          }
        }
        `;
    result = dedent(result);
    if (outfile) {
        await writeFile(process.argv.slice(2)[1], `'use strict';\nimport {SchemaBase} from "${lib_path}";\n${result}`);
        console.log(`Generated "${outfile}".`)
    }
    return result
}


function get_jsdoc_type(obj_schema) {
    let result = get(obj_schema, 'type');

    if (!result) {
        let one_of = get(obj_schema, 'oneOf') || get(obj_schema, 'anyOf');
        if (!!one_of) {
            result = uniq(one_of.map(get_jsdoc_type)).join('|')
        }
    }
    if (result === 'array') {
        let items = get(obj_schema, 'items');
        if (!!items) {
            result = result + '<' + get_jsdoc_type(items) + '>';
        }
    }
    if (!result) {
        result = 'object'
    }
    // mark some as mappings if only additional properties is supplied
    if (result === 'object' && get(obj_schema, 'properties', []).length === 0) {
        let addl = get(obj_schema, 'additionalProperties');
        if (!!addl) {
            result = 'object.<string, ' + get_jsdoc_type(addl) + '>'
        }
    }

    return result
}

function dedent(text) {
    let re_whitespace = /^([ \t]*)(.*)\n/gm;
    let l, m, i;

    while ((m = re_whitespace.exec(text)) !== null) {
        if (!m[2]) {
            continue
        }

        // noinspection JSAssignmentUsedAsCondition
        if (l = m[1].length) {
            i = (i !== undefined) ? Math.min(i, l) : l;
        } else {
            break
        }
    }

    if (i) {
        text = text.replace(new RegExp('^[ \t]{' + i + '}(.*\n)', 'gm'), '$1');
    }
    return text;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
