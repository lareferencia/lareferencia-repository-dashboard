package org.lareferencia.core.dashboard.service;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IHarvestingInformationService {
	
	Page<IHarvestingSource> listSources(Pageable pageable)  throws HarvesterInfoServiceException;
	
	Page<IHarvestingSource> listSources(List<String> whiteList, Pageable pageable)  throws HarvesterInfoServiceException;
	
	IHarvestingSource getSourceByID(Long sourceID)  throws HarvesterInfoServiceException;
	
	IHarvestingSource getSourceByAcronym(String acronym)  throws HarvesterInfoServiceException;
	
	IHarvestingResult getLastKnownGoodHarvestingBySourceID(Long sourceID) throws HarvesterInfoServiceException;
	
	IHarvestingResult getLastKnownGoodSHarvestingBySourceAcronym(String sourceAcronym) throws HarvesterInfoServiceException;
		
	Page<IHarvestingResult> getHarvestingHistoryBySourceID(Long sourceID, Pageable pageable) throws HarvesterInfoServiceException;
	
	Page<IHarvestingResult> getHarvestingHistoryBySourceAcronym(String sourceAcronym , Pageable pageable) throws HarvesterInfoServiceException;

	Page<IHarvestingResult> getHarvestingHistoryBySourceAcronym(String sourceAcronym , Date startDate, Date endDate, Pageable pageable) throws HarvesterInfoServiceException;
 
  String getRecordMetadataByRecordIDAndSourceAcronym(String sourceAcronym, Long recordID) throws HarvesterInfoServiceException;

	
}