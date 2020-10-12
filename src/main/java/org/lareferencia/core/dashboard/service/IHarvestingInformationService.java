package org.lareferencia.core.dashboard.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IHarvestingInformationService {
	
	Page<IHarvestingSource> listSources(Pageable pageable)  throws HarvesterInfoServiceException;
	
	IHarvestingSource getSourceByID(Long sourceID)  throws HarvesterInfoServiceException;
	
	IHarvestingSource getSourceByAcronym(String acronym)  throws HarvesterInfoServiceException;
	
	IHarvestingResult getLastKnownGoodHarvestingBySourceID(Long sourceID) throws HarvesterInfoServiceException;
	
	IHarvestingResult getLastKnownGoodSHarvestingBySourceAcronym(String sourceAcronym) throws HarvesterInfoServiceException;
		
	Page<IHarvestingResult> getHarvestingHistoryBySourceID(Long sourceID, Pageable pageable) throws HarvesterInfoServiceException;
	
	Page<IHarvestingResult> getHarvestingHistoryBySourceAcronym(String sourceAcronym , Pageable pageable) throws HarvesterInfoServiceException;

}