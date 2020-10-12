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
package org.lareferencia.backend.repositories.jpa;

import java.util.List;

import org.lareferencia.backend.domain.Network;
import org.lareferencia.backend.domain.SnapshotIndexStatus;
import org.lareferencia.backend.domain.SnapshotStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NetworkRepository extends JpaRepository<Network, Long> {

	List<Network> findByPublishedOrderByNameAsc(boolean published);

	Network findByAcronym(String acronym);

	Page<Network> findByNameIgnoreCaseContaining(String name, Pageable pageable);

	Page<Network> findByInstitutionNameIgnoreCaseContaining(String institution, Pageable pageable);

	Page<Network> findByAcronymIgnoreCaseContaining(String filterExpression, Pageable pageRequest);
	
	@Modifying
	@Transactional
	@Query("delete from Network n where n.id = ?1")
	void deleteByNetworkID(Long network_id);

	Page<Network> findById(String filterExpression, Pageable pageRequest);

	// ns.status = :status and
	// ns.endTime >= (select max(s.endTime) from NetworkSnapshot s where s.network.id = ns.network.id and s.status = 4 and s.deleted = false)"
	@Query("select ns.network from NetworkSnapshot ns where ns.status = :status and ns.deleted = false and ns.endTime >= (select max(s.endTime) from NetworkSnapshot s where s.network.id = ns.network.id and s.deleted = false)")
	Page<Network> customFindByStatus(@Param("status") SnapshotStatus status, Pageable pageRequest);

	@Query("select ns.network from NetworkSnapshot ns where ns.indexStatus = :status and ns.deleted = false and ns.endTime >= (select max(s.endTime) from NetworkSnapshot s where s.network.id = ns.network.id and s.deleted = false)")
	Page<Network> customFindByIndexStatus(@Param("status") SnapshotIndexStatus status, Pageable pageRequest);

}
