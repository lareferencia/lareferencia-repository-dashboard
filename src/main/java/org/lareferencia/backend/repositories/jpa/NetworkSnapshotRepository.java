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

import java.util.Date;
import java.util.List;

import org.lareferencia.backend.domain.Network;
import org.lareferencia.backend.domain.NetworkSnapshot;
import org.lareferencia.backend.domain.SnapshotStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface NetworkSnapshotRepository extends JpaRepository<NetworkSnapshot, Long> {

	@Query("select ns from NetworkSnapshot ns where ns.network.id = :network_id and ns.status = 9 and ns.deleted = false and ns.endTime >= (select max(s.endTime) from NetworkSnapshot s where s.network.id = :network_id and s.status = 9 and s.deleted = false)")
	NetworkSnapshot findLastGoodKnowByNetworkID(@Param("network_id") Long networkID);

	@Query("select ns from NetworkSnapshot ns where ns.network.id = :network_id and ( ns.status = 4 or ns.status = 9 ) and ns.deleted = false and ns.endTime >= (select max(s.endTime) from NetworkSnapshot s where s.network.id = :network_id and (s.status = 4 OR s.status = 9) and s.deleted = false)")
	NetworkSnapshot findLastHarvestedByNetworkID(@Param("network_id") Long networkID);
	
	@Query("select ns from NetworkSnapshot ns where ns.network.id = :network_id and ns.endTime >= (select max(s.endTime) from NetworkSnapshot s where s.network.id = :network_id)")
	NetworkSnapshot findLastByNetworkID(@Param("network_id") Long networkID);

	List<NetworkSnapshot> findByNetworkAndDeleted(Network network, Boolean deleted);
	
	List<NetworkSnapshot> findByNetwork(Network network);
	
	Page<NetworkSnapshot> findByNetwork(Network network, Pageable pageable);

	@Query("select ns from NetworkSnapshot ns where ns.network.id = :network_id and ns.startTime >= :startDate and ns.startTime <= :endDate ")
	Page<NetworkSnapshot> findByNetworkIdAndDate(@Param("network_id") Long network_id, @Param("startDate") Date startDate, @Param("endDate") Date endDate, Pageable pageable);
	
	
	List<NetworkSnapshot> findByNetworkAndStatus(Network network, SnapshotStatus status);

	List<NetworkSnapshot> findByNetworkAndStatusOrderByEndTimeAsc(Network network, SnapshotStatus status);

	List<NetworkSnapshot> findByNetworkOrderByEndTimeAsc(Network network);
	
	Page<NetworkSnapshot> findByNetworkOrderByEndTimeAsc(Network network, Pageable page);

	List<NetworkSnapshot> findByStatusOrderByEndTimeAsc(SnapshotStatus status);

	@Query("select ns from NetworkSnapshot ns where ns.network.id = :network_id order by ns.startTime desc")
	Page<NetworkSnapshot> findByNetworkIdOrderByStartTimeDesc(@Param("network_id") Long network_id, Pageable page);
	
	@Query("select ns from NetworkSnapshot ns where ns.network.id = :network_id order by ns.startTime desc")
	Page<NetworkSnapshot> findByNetworkIdOrdered(@Param("network_id") Long network_id,  Pageable page);

	@Modifying
	@Transactional
	@Query("delete from NetworkSnapshot ns where ns.id = ?1")
	void deleteBySnapshotID(Long snapshot_id);
	
	@Modifying
	@Transactional
	@Query("delete from NetworkSnapshot ns where ns.network.id = ?1")
	void deleteByNetworkID(Long network_id);

	
}
