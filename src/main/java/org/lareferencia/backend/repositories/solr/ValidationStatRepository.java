package org.lareferencia.backend.repositories.solr;

import org.lareferencia.backend.domain.ValidationStatObservation;
import org.springframework.data.solr.repository.SolrCrudRepository;

public interface ValidationStatRepository extends SolrCrudRepository<ValidationStatObservation, String> {

	
}
