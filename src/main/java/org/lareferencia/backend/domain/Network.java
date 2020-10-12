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
import lombok.ToString;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.annotations.Type;
import org.lareferencia.backend.network.AbstractNetworkAttributes;
import org.lareferencia.backend.network.NetworkAttributesSerializer;

import javax.persistence.*;
import java.util.Collection;
import java.util.LinkedHashSet;

/**
 * NationalNetwork Entity
 */
@Entity
@Getter
@ToString
public class Network extends AbstractEntity {
	
	@Setter
	static NetworkAttributesSerializer jsonSerializer = new NetworkAttributesSerializer(); 
	
	@Setter
	@Column(nullable = false, length = 20, unique = true)
	private String acronym;
	
	@Setter
	@Column(nullable = false)
	private String name;
	
	@Setter
	@Column(nullable = true)
	private String institutionAcronym;
	
	@Setter
	@Column(nullable = false)
	private String institutionName;

	@Transient
	@Getter
	@Setter
	private AbstractNetworkAttributes attributes;

	@Type(type = "org.hibernate.type.TextType")
	private String attributesJSONSerialization;
	
	@Setter
	@OneToMany(cascade = CascadeType.ALL/*, orphanRemoval=true*/)
	@JoinColumn(name = "network_id")
	@LazyCollection(LazyCollectionOption.FALSE)
	// Si es LAZY genera problemas durante el procesamiento
	private Collection<OAIOrigin> origins = new LinkedHashSet<OAIOrigin>();

	@Setter
	@OneToMany(cascade = CascadeType.ALL /*, orphanRemoval=true*/)
	@JoinColumn(name = "network_id")
	@LazyCollection(LazyCollectionOption.FALSE)
	private Collection<NetworkSnapshot> snapshots = new LinkedHashSet<NetworkSnapshot>();

	@Setter
	@Column(nullable = false)
	private boolean published = false;

	@Setter
	private String scheduleCronExpression;

	@Setter
	@OneToMany(cascade = CascadeType.ALL/*, orphanRemoval=true*/)
	@JoinColumn(name = "network_id")
	@LazyCollection(LazyCollectionOption.FALSE)
	private Collection<NetworkProperty> properties = new LinkedHashSet<NetworkProperty>();
	
	@Getter
	@Setter
	@ManyToOne()
	@JoinColumn(name = "validator_id", nullable = true)
	private Validator validator;

	@Getter
	@Setter
	@ManyToOne()
	@JoinColumn(name = "transformer_id", nullable = true)
	private Transformer transformer;
	
	@Getter
	@Setter
	@ManyToOne()
	@JoinColumn(name = "secondary_transformer_id", nullable = true)
	private Transformer secondaryTransformer;


	/***
	 * Método de ayuda para lectura de propiedade booleanas si la propieda
	 * existe devuelve su valor o false en otro caso
	 * 
	 * @param propertyName
	 *            nombre de la propiedad
	 * @return
	 ***/
	@Transient
	public Boolean getBooleanPropertyValue(String propertyName) {

		Boolean retValue = false;

		for (NetworkProperty property : this.getProperties())
			if (property.getName().equals(propertyName))
				return property.getValue();

		return retValue;
	}
	
	@PostLoad
	private void deserializeAttributes()  {
		
		// ATENCION
		// solo lo hace si attributes es null, dado que en el update vuelve a cargarla y genera lectura sucia

		if ( this.attributes == null && this.attributesJSONSerialization != null) {
			this.attributes = jsonSerializer.deserializeFromJsonString(this.attributesJSONSerialization);

		}
			
	}
	
	@PrePersist
	public void serializeAttributes()  {
		
		// ATENCION
		// solo lo hace si attributes es null, dado que en el update vuelve a cargarla y genera lectura sucia

		if ( this.attributes != null ) {
			this.attributesJSONSerialization = jsonSerializer.serializeToJsonString(this.attributes);
		}
			
	}
	
	public void setAttributesJSONSerialization(String attributesJSONSerialization) {
		this.attributesJSONSerialization = attributesJSONSerialization;
		this.attributes = jsonSerializer.deserializeFromJsonString(this.attributesJSONSerialization);
	}

}
