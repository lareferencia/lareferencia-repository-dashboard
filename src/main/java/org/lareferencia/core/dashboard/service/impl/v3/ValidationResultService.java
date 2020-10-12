package org.lareferencia.core.dashboard.service.impl.v3;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lareferencia.backend.domain.NetworkSnapshot;
import org.lareferencia.backend.domain.ValidationStatObservation;
import org.lareferencia.backend.domain.ValidatorRule;
import org.lareferencia.backend.repositories.jpa.NetworkSnapshotRepository;
import org.lareferencia.backend.repositories.solr.ValidationStatRepository;
import org.lareferencia.core.dashboard.service.IRecordValidationResult;
import org.lareferencia.core.dashboard.service.IValidationInformationService;
import org.lareferencia.core.dashboard.service.ValueCount;
import org.lareferencia.core.dashboard.service.ValidationResult;
import org.lareferencia.core.dashboard.service.ValidationInformationServiceException;
import org.lareferencia.core.dashboard.service.ValidationRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Scope;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Criteria;
import org.springframework.data.solr.core.query.FacetOptions;
import org.springframework.data.solr.core.query.FacetOptions.FacetSort;
import org.springframework.data.solr.core.query.FacetQuery;
import org.springframework.data.solr.core.query.Query;
import org.springframework.data.solr.core.query.SimpleFacetQuery;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.data.solr.core.query.SimpleStringCriteria;
import org.springframework.data.solr.core.query.result.FacetFieldEntry;
import org.springframework.data.solr.core.query.result.FacetPage;
import org.springframework.stereotype.Component;


@Component
@Scope("prototype")
public class ValidationResultService implements IValidationInformationService {
	
	
	private static Logger logger = LogManager.getLogger(ValidationResultService.class);

	@Autowired
	@Qualifier("validationSolrTemplate")
	private SolrTemplate validationSolrTemplate;
	
	@Autowired
	@Qualifier("validationSolrCoreName")
	private String validationCoreName;
	
	@Autowired
	private NetworkSnapshotRepository snapshotRepository;

	
	public static final String[] FACET_FIELDS = { "record_is_valid", "record_is_transformed", "valid_rules", "invalid_rules" };
	public static final String SNAPSHOT_ID_FIELD = "snapshot_id";
	
	public static final String OAI_IDENTIFIER_FIELD = "oai_identifier";
	public static final String RECORD_IS_VALID_FIELD = "record_is_valid";
	public static final String RECORD_IS_TRANSFORMED_FIELD = "record_is_transformed";

	public static final String VALID_RULES_FIELD = "valid_rules";
	public static final String INVALID_RULES_FIELD = "invalid_rules";

	
	public static final String INVALID_RULE_SUFFIX = "_rule_invalid_occrs";
	public static final String VALID_RULE_SUFFIX = "_rule_valid_occrs";

	
	@Autowired
	ValidationStatRepository validationStatRepository;
	
	/**
	 * Obtains validation results by snapshot ID
	 * @param snapshotID
	 * @return
	 * @throws ValidationInformationServiceException
	 */
	public ValidationResult validationResultByHarvestingID(Long snapshotID) throws ValidationInformationServiceException {
				
		NetworkSnapshot snapshot = snapshotRepository.getOne(snapshotID);
		if (snapshot == null)
			throw new ValidationInformationServiceException("Harvesting w/ ID:" + snapshotID + "do not exist");
		
		ValidationResult result = new ValidationResult();

		FacetQuery facetQuery = new SimpleFacetQuery(new SimpleStringCriteria(SNAPSHOT_ID_FIELD + ":" + snapshotID));
		
		// no se necesitan los resultados sino las reglas y sus valores de frecuencias
		facetQuery.setRows(0);

		// se limitan las opciones y se devuelven solo las facetas con al menos 1 caso
		FacetOptions facetOptions = new FacetOptions();
		facetOptions.setFacetMinCount(1);
		facetOptions.setFacetLimit(1000);
		
		// se agrega las opciones para obtener facetas sobre cada uno de los campos de facetas
		for (String facetName : FACET_FIELDS)
			facetOptions.addFacetOnField(facetName);

		facetQuery.setFacetOptions(facetOptions);

		// Consulta SOLR
		FacetPage<ValidationStatObservation> facetResult = validationSolrTemplate.queryForFacetPage(validationCoreName,facetQuery, ValidationStatObservation.class);
		

		// se transforma el formato devuelto por solr a un formato de map<string, integer> para mostrar los conteos
		Map<String, Integer> validRuleMap = obtainFacetMap(facetResult.getFacetResultPage("valid_rules").getContent());
		Map<String, Integer> invalidRuleMap = obtainFacetMap(facetResult.getFacetResultPage("invalid_rules").getContent());
		Map<String, Integer> validRecordMap = obtainFacetMap(facetResult.getFacetResultPage("record_is_valid").getContent());
		Map<String, Integer> transformedRecordMap = obtainFacetMap(facetResult.getFacetResultPage("record_is_transformed").getContent());

		result.setSize(  (int) facetResult.getTotalElements() );
		
		result.validSize = Optional.ofNullable( validRecordMap.get("true") ).orElse(0);
		result.transformedSize = Optional.ofNullable( transformedRecordMap.get("true") ).orElse(0);
		
		for (ValidatorRule rule : snapshot.getNetwork().getValidator().getRules() ) {

			String ruleID = rule.getId().toString();

			ValidationRule ruleResult = new ValidationRule();

			ruleResult.ruleID = rule.getId();
			ruleResult.validCount = Optional.ofNullable( validRuleMap.get(ruleID) ).orElse(0);
			ruleResult.invalidCount = Optional.ofNullable( invalidRuleMap.get(ruleID) ).orElse(0);
			ruleResult.name = rule.getName();
			ruleResult.description = rule.getDescription();
			ruleResult.mandatory = rule.getMandatory();
			ruleResult.quantifier = rule.getQuantifier().toString();

			result.rulesByID.put(ruleID, ruleResult);

		}

		return result;		
	}
	
	/**
	 * Obtains counts of rule evaluation results for a given snapshot and rule id
	 * @param snapshotID
	 * @param ruleID
	 * @return
	 */
	private List<ValueCount> occurreceCountByHarvestingIDAndRuleID(Long snapshotID, Long ruleID, String ruleSuffix)  {

		FacetQuery facetQuery = new SimpleFacetQuery(new SimpleStringCriteria(SNAPSHOT_ID_FIELD + ":" + snapshotID));
		facetQuery.setRows(0);

		FacetOptions facetOptions = new FacetOptions();
		facetOptions.setFacetMinCount(1);
		facetOptions.setFacetLimit(1000);

		facetOptions.addFacetOnField(ruleID.toString() + ruleSuffix);

		//facetOptions.addFacetOnField(ruleID.toString() + INVALID_RULE_SUFFIX);
		//facetOptions.addFacetOnField(ruleID.toString() + VALID_RULE_SUFFIX);

		facetOptions.setFacetSort(FacetSort.COUNT);

		facetQuery.setFacetOptions(facetOptions);

		FacetPage<ValidationStatObservation> facetResult = validationSolrTemplate.queryForFacetPage(validationCoreName,facetQuery, ValidationStatObservation.class);

		List<ValueCount> result = new ArrayList<ValueCount>();

		for (FacetFieldEntry occr : facetResult.getFacetResultPage(ruleID.toString() + ruleSuffix).getContent())
			result.add(new ValueCount(occr.getValue(), (int) occr.getValueCount()));

		return result;
	}
	
	
	@Override
	public List<ValueCount> validOccurrenceCountByHarvestingIDAndRuleID(Long harvestingID, Long ruleID) {
		return occurreceCountByHarvestingIDAndRuleID(harvestingID, ruleID, VALID_RULE_SUFFIX);
	}

	@Override
	public List<ValueCount> invalidOccurrenceCountByHarvestingIDAndRuleID(Long harvestingID, Long ruleID) {
		return occurreceCountByHarvestingIDAndRuleID(harvestingID, ruleID, INVALID_RULE_SUFFIX);
	}
	
	/**
	 * 
	 * @param snapshotID
	 * @param pageable
	 * @return
	 */
	public Page<IRecordValidationResult> recordValidationResultsByHarvestingID(Long snapshotID, Optional<Boolean> isValid, Optional<Boolean> isTransformed, Optional<List<String>> validRuleIds, Optional<List<String>> invalidRuleIds, Optional<String> oaiIdentifier,  Pageable pageable) {

	    Criteria conditions = new Criteria(SNAPSHOT_ID_FIELD).is(snapshotID.toString());
	    
	    if ( oaiIdentifier.isPresent() )
	    	conditions = conditions.and( new Criteria(OAI_IDENTIFIER_FIELD).is(oaiIdentifier.get()) );
	    
	    if ( isValid.isPresent() )
	    	conditions = conditions.and( new Criteria(RECORD_IS_VALID_FIELD).is(isValid.get()) );
	    
	    if ( isTransformed.isPresent() )
	    	conditions = conditions.and( new Criteria(RECORD_IS_TRANSFORMED_FIELD).is(isTransformed.get()) );
	   
	    if ( invalidRuleIds.isPresent() )
	    	for (String ruleId: invalidRuleIds.get())
	    		conditions = conditions.and( new Criteria(INVALID_RULES_FIELD).is(ruleId) );
	   
	    if ( validRuleIds.isPresent() )
	    	for (String ruleId: validRuleIds.get())
	    		conditions = conditions.and( new Criteria(VALID_RULES_FIELD).is(ruleId) );
	    
		Query query = new SimpleQuery(conditions, pageable);	
		Page<ValidationStatObservation> page = validationSolrTemplate.queryForPage(validationCoreName,query, ValidationStatObservation.class);
		
		// builds a page based on result.
		Page<IRecordValidationResult> results = new PageImpl<IRecordValidationResult>(page.getContent().stream().map( o -> new ValidationStatObservation3IRecordValidationResultAdapter(o) ).collect(Collectors.toList()), pageable, page.getTotalElements());
	
		return results;
	}
	
	

	
	/**
	 * Retorna un Map entre los ids y los nombres de las reglas
	 */
	private Map<String, Integer> obtainFacetMap(List<FacetFieldEntry> facetList) {

		Map<String, Integer> facetMap = new HashMap<String, Integer>();

		for (FacetFieldEntry entry : facetList)
			facetMap.put(entry.getValue(), (int) entry.getValueCount());

		return facetMap;
	}

	

}
