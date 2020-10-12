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
 * Este software fue desarrollado en el marco de la consultoría "Desarrollo e implementación de las soluciones - Prueba piloto del Componente III -Desarrollador para las herramientas de back-end" del proyecto “Estrategia Regional y M$
 ******************************************************************************/
package org.lareferencia.backend.network;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LAReferenciaNetworkAttributes extends BaseNetworkAttributes {

	@Getter
	@Setter
        @JsonProperty("institution_type")
        private String institution_type;

	@Getter
	@Setter
        @JsonProperty("institution_url")
        private String institution_url;

	@Getter
	@Setter
        @JsonProperty("source_type")
        private String source_type;

	@Getter
	@Setter
        @JsonProperty("source_url")
        private String source_url;

	@Getter
	@Setter
        @JsonProperty("oai_url")
        private String oai_url;

	@Getter
	@Setter
        @JsonProperty("lastname_firstname_responsible")
        private String lastname_firstname_responsible;


	@Getter
	@Setter
        @JsonProperty("responsible_charge")
        private String responsible_charge;


	@Getter
	@Setter
        @JsonProperty("contact_email")
        private String contact_email;


	@Getter
	@Setter
        @JsonProperty("country")
        private String country;


	@Getter
	@Setter
        @JsonProperty("city")
        private String city;


	@Getter
	@Setter
        @JsonProperty("telephone")
        private String telephone;


	@Getter
	@Setter
        @JsonProperty("software")
        private String software ;


	@Getter
	@Setter
        @JsonProperty("journal_title")
        private String journal_title;


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


	@Getter
	@Setter
        @JsonProperty("repository_id")
        private String repository_id;


        public LAReferenciaNetworkAttributes() {


        }

}

