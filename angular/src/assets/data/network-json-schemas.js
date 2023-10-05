/* 
 *  This is the default license template.
 *  
 *  File: network-json-schemas.js
 *  Author: lmatas
 *  Copyright (c) 2022 lmatas
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

angular.module('network.json.schemas', []).service('JSONNetworkSchemas',  function() {
	
    /** Datos de formulario Network **/
	this.network_schema = {
	    type: "object",
	    properties: {
		  acronym : { type: "string", minLength: 2, maxLength: 10, title: "Acrónimo repositorio", description: "Acrónimo identificatorio del repositorio (debe ser único)", required: true },
	      name: { type: "string", minLength: 2, title: "Repositorio", description: "Nombre de repositorio", required: true },
	      institutionAcronym: { type: "string", minLength: 2, title: "Acrónimo Institución", description: "Acrónimo de la Institución", required: true},
	      institutionName: { type: "string", minLength: 2, title: "Institución", description: "Nombre Institución", required: true},
	      published :{ type: "boolean", title: "¿Es pública?", description: "La red es visible al público" },
	      scheduleCronExpression : { type: "string", title: "Cron de cosecha", description: "Expresión cron para programar la cosecha", "default": "* 0 0 29 2 *" }, 
	      
	      originURL: { type: "string", title: "OAI-PMH URL", description: "Harvesting URL", required: false},
	      
	      metadataPrefix: {
				"title": "Metadata Prefix",
				"type": "string",
				"enum": ["mtd-br","imf","mets","oai_dc","xoai","mtd2-br","oai_openaire","oai_openaire_jats","oai_datacite"],
				"default": "oai_dc"
		  },
		        
	      sets: {
	          "type": "array",
	          "title": "Sets",
	          "items": {
	            "type": "string",
	            "title": "SetSpec"
	          }
	      },
	     
		  metadataStoreSchema: {
				"title": "Metadata Store Format",
				"type": "string",
				"enum": ["xoai","xoai_openaire"],
				"default": "xoai"
		  },
		  	      
	    }
	 };
	
	this.network_form = [ 
	  { "type": "help",
	    "helpvalue": "<div class=\"alert alert-info\">Datos principales y origen de cosecha</div>"
	  },
	  { type: "submit", title: "Guardar cambios" },
	  {
	    "type": "section",
	    "htmlClass": "row",
	    "items": [
	      {
	        "type": "section",
	        "htmlClass": "col-xs-6",
	        "items": [
	          "acronym"
	        ]
	      },
	      {
	        "type": "section",
	        "htmlClass": "col-xs-6",
	        "items": [
	          "name"
	        ]
	      }
	    ]
	  },
	  {
	    "type": "section",
	    "htmlClass": "row",
	    "items": [
	      {
	        "type": "section",
	        "htmlClass": "col-xs-6",
	        "items": [
	          "institutionAcronym"
	        ]
	      },
	      {
	        "type": "section",
	        "htmlClass": "col-xs-6",
	        "items": [
	          "institutionName"
	        ]
	      }
	    ]
	   },
	   {
		    "type": "section",
		    "htmlClass": "row",
		    "items": [
		      {
		        "type": "section",
		        "htmlClass": "col-xs-4",
		        "items": [
		          "scheduleCronExpression"
		        ]
		      },
		      {
		        "type": "section",
		        "htmlClass": "col-xs-4",
		        "items": [
		          "metadataStoreSchema"
		        ]
			  },
			  {
		        "type": "section",
		        "htmlClass": "col-xs-4",
		        "items": [
		          "published"
		        ]
			  },
		    ]
	   },
	   {
		    "type": "section",
		    "htmlClass": "row",
		    "items": [
		      {
		        "type": "section",
		        "htmlClass": "col-xs-8",
		        "items": [
		          "originURL"
		        ]
		      },
		      {
		        "type": "section",
		        "htmlClass": "col-xs-4",
		        "items": [
		          "metadataPrefix"
		        ]
			  },
		    ]
	   },
	   {
		    "type": "section",
		    "htmlClass": "row",
		    "items": [
		      {
		        "type": "section",
		        "htmlClass": "col-xs-8",
		        "items": [
		          "sets"
		        ]
		      },
		      {
		        "type": "section",
		        "htmlClass": "col-xs-4",
		        "items": [
		          
		        ]
			  },
		    ]
	   },
	   
	   
		  
	  { type: "submit", title: "Guardar cambios" }
	];
	
	this.network_validation_schema = {
		 type: "object",
		    properties: {
			  prevalidator: { type: "string", title: "Pre Validador", description: "Validador usado como filtro inicial para la entrada de registros cosechados" },
		      validator: { type: "string", title: "Validador", description: "Validador para el cumplimiento de directrices" },
		      transformer: { type: "string", title: "Transformador Primario", description: "Transformador genérico para un grupo de repositorios" },
		      secondaryTransformer: { type: "string", title: "Transformador Secundario", description: "Transformador conteniendo reglas específicas para el repositorio" },
		    }	
	};
	
	this.network_validation_form =  function(validatorsArray, transformersArray) {

		validatorTitleMap = {'':'Sin validador asociado'};
		transformerTitleMap = {'':'Sin transformador asociado'};
		
		for (var i=0;i<validatorsArray.length;i++) {
			var validator = validatorsArray[i];
			validatorTitleMap[ validator._links.self.href ] = validator.name;
		}
		
		for (var i=0;i<transformersArray.length;i++) {
			var transformer = transformersArray[i];
			transformerTitleMap[ transformer._links.self.href ] = transformer.name;
		}
		
		
		return [ { "type": "help", "helpvalue": "<div class=\"alert alert-info\">Especifique que validadores y transformadores se aplican.</div>"},	
			
				 { key: "prevalidator", type: "select", "titleMap": validatorTitleMap },
				 { key: "validator", type: "select", "titleMap": validatorTitleMap },
		         { key: "transformer", type: "select", "titleMap": transformerTitleMap },
		         { key: "secondaryTransformer", type: "select", "titleMap": transformerTitleMap },
		         { type: "submit", title: "Guardar cambios" }
		       ];
		
	};
	
	this.buildTitleMap =  function(keyName, objArray) {

		objTitleMap = {};
		
		for (var i=0;i<objArray.length;i++) {
			var obj = objArray[i];
			objTitleMap[ obj._links.self.href ] = obj.name;
		}
	
		return  { "key": keyName, type: "select", "titleMap": objTitleMap };
		       
	};
	      	                       
	                         	    
	
	
    /** Datos de formulario Network Properties **/
	
	this.generate_network_actions_schema = function(propertiesArray) {
		
		var schema = { type: "object", properties: {} };
		
		for (var i=0;i<propertiesArray.length;i++) {
			var property = propertiesArray[i];
			schema.properties[property.name] = { type: "boolean", title: property.description + " (" + property.name + ") "};
		}
		
		return schema;
	};
	
	this.generate_network_actions_model = function(propertiesArray) {
		
		var model = {};
		
		for (var i=0;i<propertiesArray.length;i++) {
			var property = propertiesArray[i];
			model[property.name] = property.value;
		}
		
		return model;
	};
		
	
	this.network_properties_form = [
	{ "type": "help", "helpvalue": "<div class=\"alert alert-info\">Determine que acciones se ejecutan en las cosechas programadas.</div>"},	
	{ type: "submit", title: "Guardar cambios" }, 
	{"type": "section", "htmlClass": "row", "items": [ 
		{ "type": "section", "htmlClass": "col-xs-12", "items": [ 
			"*"
		] } 
	] }, 
	{ "type": "submit", title: "Guardar cambios" } ];
	

});
