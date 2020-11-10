package org.lareferencia.core.dashboard.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IValidationInformationService {
	

	public IValidationResult   validationResultByHarvestingID(String networkAcronym, Long harvestingID) throws ValidationInformationServiceException;

	public Page<IRecordValidationResult> recordValidationResultsByHarvestingID(String networkAcronym, Long snapshotID, Optional<Boolean> isValid, Optional<Boolean> isTrasformed, Optional<List<String>> validRuleIds, Optional<List<String>> invalidRuleIds, Optional<String> oaiIdentifier,  Pageable pageable) throws ValidationInformationServiceException;

	public List<ValueCount> validOccurrenceCountByHarvestingIDAndRuleID(String networkAcronym, Long harvestingID, Long ruleID) throws ValidationInformationServiceException;
	public List<ValueCount> invalidOccurrenceCountByHarvestingIDAndRuleID(String networkAcronym, Long harvestingID, Long ruleID) throws ValidationInformationServiceException;


}
