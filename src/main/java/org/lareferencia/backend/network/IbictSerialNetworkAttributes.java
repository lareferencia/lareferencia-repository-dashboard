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

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class IbictSerialNetworkAttributes extends BaseNetworkAttributes {
	
	
	@Getter
	@Setter
	@JsonProperty("institution_type") 
	private String institution_type;

	@Getter
	@Setter
	@JsonProperty("state") 
	private String state;
	
	@Getter
	@Setter
	@JsonProperty("city") 
	private String city;
	
	@Getter
	@Setter
	@JsonProperty("sector") 
	private String sector;
	
	@Getter
	@Setter
	@JsonProperty("address") 
	private String address;
	
	@Getter
	@Setter
	@JsonProperty("postal_code") 
	private String postal_code;
	
	@Getter
	@Setter
	@JsonProperty("telephone") 
	private String telephone;
	
	@Getter
        @Setter
        @JsonProperty("latitude") 
        private String latitude;
	
	@Getter
        @Setter
        @JsonProperty("longitude") 
        private String longitude;

	@Getter
	@Setter
	@JsonProperty("source_url") 
	private String source_url;
	
	@Getter
	@Setter
	@JsonProperty("oai_url") 
	private String oai_url;
	
/*opendoar_url*/
        @Getter
        @Setter
        @JsonProperty("opendoar_url")
        private String opendoar_url;

/*opendoar_id*/
        @Getter
        @Setter
        @JsonProperty("repository_id")
        private String source_id;
	
	@Getter
	@Setter
	@JsonProperty("contact_email") 
	private String email;
	
	@Getter
	@Setter
	@JsonProperty("mailing_list") 
	private List<String> mailing_list;
	
	@Getter
	@Setter
	@JsonProperty("content_type") 
	private String content_type;
	
/*tipo de fonte*/
        @Getter
        @Setter
        @JsonProperty("source_type")
        private String source_type;
	
	@Getter
	@Setter
	@JsonProperty("language") 
	private String language;
	
	@Getter
	@Setter
	@JsonProperty("software") 
	private String software;
	
	@JsonProperty("internalNotes")
	private String internalNotes = "";
	

	@Getter
	@Setter
	@JsonProperty("doi") 
	private String doi;
	
	@Getter
	@Setter
	@JsonProperty("issn") 
	private String issn;
	
	@Getter
	@Setter
	@JsonProperty("issn_l") 
	private String issn_l;
	
	public IbictSerialNetworkAttributes() {
	}

}
