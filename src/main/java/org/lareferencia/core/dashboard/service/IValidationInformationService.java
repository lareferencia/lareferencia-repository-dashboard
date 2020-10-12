package org.lareferencia.core.dashboard.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IValidationInformationService {
	

	public IValidationResult   validationResultByHarvestingID(Long harvestingID) throws ValidationInformationServiceException;

	public Page<IRecordValidationResult> recordValidationResultsByHarvestingID(Long snapshotID, Optional<Boolean> isValid, Optional<Boolean> isTrasformed, Optional<List<String>> validRuleIds, Optional<List<String>> invalidRuleIds, Optional<String> oaiIdentifier,  Pageable pageable);

	public List<ValueCount> validOccurrenceCountByHarvestingIDAndRuleID(Long harvestingID, Long ruleID);
	public List<ValueCount> invalidOccurrenceCountByHarvestingIDAndRuleID(Long harvestingID, Long ruleID);


}
