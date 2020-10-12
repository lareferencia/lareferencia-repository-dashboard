/*******************************************************************************
 * Copyright (c) 2013 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the GNU Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * 
 * Contributors:
 *     Lautaro Matas (lmatas@gmail.com) - Desarrollo e implementación
 *     Emiliano Marmonti(emarmonti@gmail.com) - Coordinación del componente III
 * 
 * Este software fue desarrollado en el marco de la consultoría "Desarrollo e implementación de las soluciones - Prueba piloto del Componente III -Desarrollador para las herramientas de back-end" del proyecto “Estrategia Regional y Marco de Interoperabilidad y Gestión para una Red Federada Latinoamericana de Repositorios Institucionales de Documentación Científica” financiado por Banco Interamericano de Desarrollo (BID) y ejecutado por la Cooperación Latino Americana de Redes Avanzadas, CLARA.
 ******************************************************************************/
package org.lareferencia.backend.network;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RCAAPNetworkAttributes extends BaseNetworkAttributes {
	
	@JsonProperty("isni")
	private String isni = "";
	
	@JsonProperty("url")
	private String url = "";
	
	@JsonProperty("email")
	private String email = "";
	
	@JsonProperty("ringold")
	private String ringold = "";
	
	@JsonProperty("type")
	private String type = "";
	
	@JsonProperty("software")
	private String software = "";
		
	@JsonProperty("description_pt")
	private String description_pt = "";
	
	@JsonProperty("description_en")
	private String description_en = "";
	
	@JsonProperty("country")
	private String country = "";
	
	@JsonProperty("directoryURL")
	private String directoryURL = "";
	
	@JsonProperty("oaiURL")
	private String oaiURL = "";
	
	@JsonProperty("roarMap")
	private String roarMap = "";
	
	@JsonProperty("openDoar")
	private String openDoar = "";
	
	@JsonProperty("sherpa")
	private String sherpa = "";
	
	@JsonProperty("eissn")
	private String eissn = "";
	
	@JsonProperty("pissn")
	private String pissn = "";
	
	@JsonProperty("issnL")
	private String issnL = "";
	
	@JsonProperty("tags")
	private String[] tags = {};
	
	@JsonProperty("handle")
	private String handle = "";
	
	@JsonProperty("degois")
	private Boolean degois = false;
	
	@JsonProperty("cienciaVitae")
	private Boolean cienciaVitae = false;
	
	@JsonProperty("cienciaId")
	private Boolean cienciaId = false;
	
	@JsonProperty("openAIRE")
	private Boolean openAIRE = false;
	
	@JsonProperty("openAIRE4")
	private Boolean openAIRE4 = false;
	
	@JsonProperty("driver")
	private Boolean driver = false;
	
	@JsonProperty("fct")
	private Boolean fct = false;
	
	@JsonProperty("thesis")
	private Boolean thesis = false;
	
	@JsonProperty("fulltext")
	private Boolean fulltext = false;
	
	@JsonProperty("accessibleContent")
	private Boolean accessibleContent = false;
	
	@JsonProperty("responsibleName")
	private String responsibleName = "";
	
	@JsonProperty("phone")
	private String phone = "";
	
	@JsonProperty("internalNotes")
	private String internalNotes = "";
	
	@JsonProperty("handlePrefix")
	private String handlePrefix = "";
	
	@JsonProperty("doiPrefix")
	private String doiPrefix = "";
	
	public RCAAPNetworkAttributes() {
		
	}
	
}
