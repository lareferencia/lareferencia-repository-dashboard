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

import org.lareferencia.backend.domain.OAIRecord;
import org.lareferencia.backend.domain.RecordStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;



public interface OAIRecordRepository extends JpaRepository<OAIRecord, Long> {

	/* obtener registro por snapshot_id e identifier */

	@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and rc.identifier = ?2")
	OAIRecord findOneBySnapshotIdAndIdentifier(Long snapshotID, String identifier);


	/// Paginados y optimizados 
	
	@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and rc.id > ?4 and ((false=?3 AND rc.status=?2) OR (true=?3 AND rc.status<>?2)) order by rc.id asc")
	Page<OAIRecord> findBySnapshotIdAndStatusOptimizedOrderByRecordID(Long snapshotID, RecordStatus status, Boolean negateStatus, Long lastRecordID, Pageable pageable);

	@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and rc.datestamp > ?4 and rc.id > ?5 and ((false=?3 AND rc.status=?2) OR (true=?3 AND rc.status<>?2)) order by rc.id asc")
	Page<OAIRecord> findBySnapshotIdAndStatusAndDateOptimizedOrderByRecordID(Long snapshotID, RecordStatus status, Boolean negateStatus, Date date, Long lastRecordID, Pageable pageable);

	@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and rc.id > ?2 order by rc.id asc")
	Page<OAIRecord> findBySnapshotIdOptimizedOrderByRecordID(Long snapshotID, Long lastRecordID, Pageable pageable);
	
	@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and rc.datestamp > ?2 and rc.id > ?3 order by rc.id asc")
	Page<OAIRecord> findBySnapshotIdAndDateOptimizedOrderByRecordID(Long snapshotID, Date from, Long lastRecordID, Pageable pageable);

	@Modifying
	@Transactional
	@Query("delete from OAIRecord r where r.snapshot.id = ?1")
	void deleteBySnapshotID(Long snapshot_id);

	/* Paginación optimizada por snapshot id y status, con posibilidad de negar el status*/
	//@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and ((false=?3 AND rc.status=?2) OR (true=?3 AND rc.status<>?2))  order by rc.id asc")
	//Page<OAIRecord> findBySnapshotIdAndStatusAndDateOrderByRecordID(Long snapshotID, RecordStatus status, Boolean negateStatus, Date date, Pageable pageable);
	
	/* Paginación optimizada por snapshot id y status, con posibilidad de negar el status*/
	//@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 and ((false=?3 AND rc.status=?2) OR (true=?3 AND rc.status<>?2))  order by rc.id asc")
	//Page<OAIRecord> findBySnapshotIdAndStatusOrderByRecordID(Long snapshotID, RecordStatus status, Boolean negateStatus, Pageable pageable);
	
	///	@Query("select rc from OAIRecord rc where rc.snapshot.id = ?1 order by rc.id asc")
	///	Page<OAIRecord> findBySnapshotIdOrderByRecordID(Long snapshotID, Pageable pageable);

	
}
