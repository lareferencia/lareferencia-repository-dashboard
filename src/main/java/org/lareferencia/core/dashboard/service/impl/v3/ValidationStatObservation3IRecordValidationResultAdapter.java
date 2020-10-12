package org.lareferencia.core.dashboard.service.impl.v3;

import java.util.List;
import java.util.Map;

import org.lareferencia.backend.domain.ValidationStatObservation;
import org.lareferencia.core.dashboard.service.IRecordValidationResult;

public class ValidationStatObservation3IRecordValidationResultAdapter implements IRecordValidationResult {
	
	ValidationStatObservation observation;
	
	public ValidationStatObservation3IRecordValidationResultAdapter(ValidationStatObservation observation) {
		super();
		this.observation = observation;
	}

	@Override
	public String getId() {

		return observation.getId();
	}

	@Override
	public String getIdentifier() {

		return observation.getIdentifier();
	}

	@Override
	public Long getSnapshotID() {

		return observation.getSnapshotID();
	}

	@Override
	public String getOrigin() {

		return observation.getOrigin();
	}

	@Override
	public String getSetSpec() {

		return observation.getSetSpec();
	}

	@Override
	public String getMetadataPrefix() {

		return observation.getMetadataPrefix();
	}

	@Override
	public Boolean getIsValid() {

		return observation.getIsValid();
	}

	@Override
	public Boolean getIsTransformed() {

		return observation.getIsTransformed();
	}

	@Override
	public Map<String, List<String>> getValidOccurrencesByRuleID() {
		return observation.getValidOccurrencesByRuleID();
	}

	@Override
	public Map<String, List<String>> getInvalidOccurrencesByRuleID() {

		return observation.getInvalidOccurrencesByRuleID();
	}

	@Override
	public List<String> getValidRulesID() {

		return observation.getValidRulesID();
	}

	@Override
	public List<String> getInvalidRulesID() {

		return observation.getInvalidRulesID();
	}

}
