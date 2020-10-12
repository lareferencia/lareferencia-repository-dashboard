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
package org.lareferencia.backend.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;


/**
 * Project Entity
 */


@Entity
@Getter
@Setter
public class Historic extends AbstractEntity {

	@Column(nullable = false)
	private int restrictedAccess;

	@Column(nullable = false)
	private int embargoedAccess;

	@Column(nullable = false)
	private int closedAccess;

	@Column(nullable = false)
	private int metadataOnlyAccess;

	@Column(nullable = false)
	private int openAccess;

	@Column(nullable = false)
	private int year;

	@Column(nullable = false)
	private int month;

	@Column(nullable = false)
	private int day;
	
	@Column(nullable = false)
	private String archive_acronym;

	@Column(nullable = false)
	private long network_id;

}
