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

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PostLoad;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.annotations.Type;
import org.lareferencia.backend.metadata.OAIRecordMetadata;
import org.lareferencia.backend.metadata.OAIRecordMetadata.OAIRecordMetadataParseException;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

/**
 * 
 */
@Getter
@Entity
@JsonIgnoreProperties({ "originalXML","publishedXML", "snapshot", "datestamp", "metadata" })
public class OAIRecord extends AbstractEntity {
	
	private static Logger logger = LogManager.getLogger(OAIRecord.class);

	@Transient
	private OAIRecordMetadata metadata;
	
	@Column(nullable = false)
	private String identifier;
	
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "origin_id")
	private OAIOrigin origin;
	
	@Setter
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable = false)
	private Date datestamp;

	@Type(type = "org.hibernate.type.TextType")
	private String publishedXML;
	
	@Getter
	@Type(type = "org.hibernate.type.TextType")
	private String originalXML;

	@Setter
	@Column(nullable = false)
	private RecordStatus status;
	
	@Setter
	@Column(nullable = false)
	private boolean wasTransformed;

	@Getter
	@ManyToOne(fetch = FetchType.EAGER, optional = false)
	@JoinColumn(name = "snapshot_id")
	private NetworkSnapshot snapshot;

	public OAIRecord() {
		super();
		this.status = RecordStatus.UNTESTED;
		this.datestamp = new Date();
	}

	public OAIRecord(NetworkSnapshot snapshot, OAIOrigin origin,  OAIRecordMetadata metadata) {
		super();
		this.snapshot = snapshot;
		this.status = RecordStatus.UNTESTED;
		this.datestamp = new Date();
		this.metadata = metadata;
		this.originalXML = metadata.toString();
		this.origin = origin;
		updateIdentifier();
	}
	
	public boolean update(OAIRecordMetadata metadata) {
		
		String newXMLString =  metadata.toString(); 
		
		boolean need_update = ! this.originalXML.equals( newXMLString );
	
		if ( need_update ) {		
			this.status = RecordStatus.UNTESTED;
			this.datestamp = new Date();
			this.metadata = metadata;
			this.originalXML = newXMLString;
			updateIdentifier();
		}
		
		return need_update;
	}
	
	@PostLoad
	private void loadMetadata() throws OAIRecordMetadataParseException {
		
		// ATENCION
		// solo lo hace si metadata es null, dado que en el update vuelve a cargarla y genera lectura sucia
		if ( this.metadata == null && this.publishedXML != null && this.publishedXML.length() > 0) {
			this.metadata = new OAIRecordMetadata(this.identifier, this.publishedXML);
		}
			
	
	}
	
	// cuando se requiere la revalidacion del regisrto original se carga la metadata del originalXML
	public void resetMetadata() throws OAIRecordMetadataParseException {
		
		if ( this.originalXML != null && this.originalXML.length() > 0) {
			this.metadata = new OAIRecordMetadata(this.identifier, this.originalXML);
		}
	
	}
	
	
	private void updateIdentifier() {
		this.identifier = metadata.getIdentifier();
	}

	public void setSnapshot(NetworkSnapshot snapshot) {
		this.snapshot = snapshot;
		updateIdentifier();
	}

	public void updatePublishedXML() {
		//logger.debug(("Grabando metadata a XML)Published");

		/* El XML publicado será la versión de la metadata si no es null */
		if (this.metadata != null)
			publishedXML = metadata.toString();
	}
	
	
	
	
	
}
