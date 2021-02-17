'use strict';
import {SchemaBase} from "schemaperfect";

/** AssessmentModuleView
Each assessment module may define a series of views which are then to visualize the assessment data.

* @property {string} module_view_id (Optional) An id used to distinguish module views on a module with the same type and variable. If not specified, the variable will be used.
* @property {string} type undefined
* @property {null|string} variable undefined
* @property {string} variable_unit The variable unit that this module view represents. Use "view_group_id" to specify multiple variable units for the same variable
* @property {array<string>} view_scales (Optional) Limits the available view scales for the given view. If not specified, the module's assessment levels will be used.
* @property {string} title undefined
* @property {string} legend_tip A label for the map legends related to this view. Useful for describing units more clearly.
* @property {boolean,string} quartile_overlay_mode The quartile that should be featured when using "Overlay mode" in AccelAdapt Online. Options: upper, lower, both (true), or false.
* @property {array<string>} feature_stats Determines the presentation and order of stats in the overview page / cards. If not specified, defaults to ['count', 'count_percent','improvement_value'] for parcel-based modules, and ['count','count_percent'] for all others.
* @property {array<string>} feature_stats_labels Provides additional labels for individual stats defined in 'feature_stats'.
* @property {string} id undefined
* @property {boolean} feature undefined
* @property {array} available_aggregate_units This property restricts the given view to a subset of aggregate maps by variable unit.
* @property {string} view_group_id (Future feature) This property replaces the 'available_aggregate_units' structure to allow multiple separate module views to share the same overarching namespace
* @property {object} legend_description undefined
* @property {object} button_label undefined
*/
export class AssessmentModuleView extends SchemaBase {
  get _schema(){
    if(!this.__schema){
        this.__schema =  JSON.parse(`{"title":"AssessmentModuleView","description":"Each assessment module may define a series of views which are then to visualize the assessment data.","type":"object","additionalProperties":false,"properties":{"module_view_id":{"description":"(Optional) An id used to distinguish module views on a module with the same type and variable. If not specified, the variable will be used.","type":"string"},"type":{"title":"ViewType","type":"string","enum":["asset_threat_pair","threat","asset","auxiliary"]},"variable":{"anyOf":[{"type":"null"},{"type":"string"}]},"variable_unit":{"description":"The variable unit that this module view represents. Use \"view_group_id\" to specify multiple variable units for the same variable","type":"string"},"view_scales":{"description":"(Optional) Limits the available view scales for the given view. If not specified, the module's assessment levels will be used.","type":"array","items":{"type":"string"}},"title":{"type":"string"},"legend_tip":{"description":"A label for the map legends related to this view. Useful for describing units more clearly.","type":"string"},"quartile_overlay_mode":{"description":"The quartile that should be featured when using \"Overlay mode\" in AccelAdapt Online. Options: upper, lower, both (true), or false.","type":["boolean","string"],"enum":["upper","lower","both",true,false]},"feature_stats":{"description":"Determines the presentation and order of stats in the overview page / cards. If not specified, defaults to ['count', 'count_percent','improvement_value'] for parcel-based modules, and ['count','count_percent'] for all others.","type":"array","items":{"type":"string"}},"feature_stats_labels":{"description":"Provides additional labels for individual stats defined in 'feature_stats'.","type":"array","items":{"type":"string"}},"id":{"type":"string","deprecationMessage":"Deprecated, use 'module_view_id' instead"},"feature":{"type":"boolean","deprecationMessage":"Deprecated, use 'project.feature_most_affected_views', 'project.feature_socioeconomic_views', 'project.feature_economic_views', or 'module_view.feature_stats' instead."},"available_aggregate_units":{"description":"This property restricts the given view to a subset of aggregate maps by variable unit.","type":"array","deprecationMessage":"Renamed to 'variable_units'"},"view_group_id":{"description":"(Future feature) This property replaces the 'available_aggregate_units' structure to allow multiple separate module views to share the same overarching namespace","type":"string"},"legend_description":{},"button_label":{}},"required":["title","variable","type"]}`)
    }
    return this.__schema
  }
    
  get _property_names(){
    return ["module_view_id", "type", "variable", "variable_unit", "view_scales", "title", "legend_tip", "quartile_overlay_mode", "feature_stats", "feature_stats_labels", "id", "feature", "available_aggregate_units", "view_group_id", "legend_description", "button_label"]
  }
  
  constructor({module_view_id=null, type=null, variable=null, variable_unit=null, view_scales=null, title=null, legend_tip=null, quartile_overlay_mode=null, feature_stats=null, feature_stats_labels=null, id=null, feature=null, available_aggregate_units=null, view_group_id=null, legend_description=null, button_label=null}){
    super({module_view_id, type, variable, variable_unit, view_scales, title, legend_tip, quartile_overlay_mode, feature_stats, feature_stats_labels, id, feature, available_aggregate_units, view_group_id, legend_description, button_label})
  }
}
        


/** 
The quartile that should be featured when using "Overlay mode" in AccelAdapt Online. Options: upper, lower, both (true), or false.


*/
export class quartile_overlay_mode extends SchemaBase {
  get _schema(){
    if(!this.__schema){
        this.__schema =  JSON.parse(`{"description":"The quartile that should be featured when using \"Overlay mode\" in AccelAdapt Online. Options: upper, lower, both (true), or false.","type":["boolean","string"],"enum":["upper","lower","both",true,false]}`)
    }
    return this.__schema
  }
    
  get _property_names(){
    return []
  }
  
  constructor({}){
    super({})
  }
}

