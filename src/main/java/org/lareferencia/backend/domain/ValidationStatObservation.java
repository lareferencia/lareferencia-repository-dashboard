package org.lareferencia.backend.domain;

import lombok.Getter;
import lombok.Setter;
import org.apache.solr.client.solrj.beans.Field;
import org.springframework.data.annotation.Id;
import org.springframework.data.solr.core.mapping.Dynamic;
import org.springframework.data.solr.core.mapping.SolrDocument;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


//TODO solrCoreName is set in two different places and need to be changed in both to work correctly

@Getter
@Setter
@SolrDocument(collection="vstats")
public class ValidationStatObservation {
	
	public static final String[] FACET_FIELDS = { "record_is_valid", "record_is_transformed", "valid_rules", "invalid_rules", "institution_name", "repository_name" };
	public static final String SNAPSHOT_ID_FIELD = "snapshot_id";
	public static final String INVALID_RULE_SUFFIX = "_rule_invalid_occrs";
	public static final String VALID_RULE_SUFFIX = "_rule_valid_occrs";
	
	
	@Id
	@Field
	private String id;

	@Field("oai_identifier")
	private String identifier;

	@Field(SNAPSHOT_ID_FIELD)
	private Long snapshotID;

	@Field("origin")
	private String origin;

	@Field("set_spec")
	private String setSpec;
	
	@Field("metadata_prefix")
	private String metadataPrefix;

	@Field("network_acronym")
	private String networkAcronym;

	@Field("repository_name")
	private String repositoryName;

	@Field("institution_name")
	private String institutionName;

	@Field("record_is_valid")
	private Boolean isValid;

	@Field("record_is_transformed")
	private Boolean isTransformed;

	@Dynamic
	@Field("*" + VALID_RULE_SUFFIX)
	private Map<String, List<String>> validOccurrencesByRuleID;

	@Dynamic
	@Field("*" + INVALID_RULE_SUFFIX)
	private Map<String, List<String>> invalidOccurrencesByRuleID;

	@Field("valid_rules")
	private List<String> validRulesID;

	@Field("invalid_rules")
	private List<String> invalidRulesID;

	
	public ValidationStatObservation() {
		super();
		
		validOccurrencesByRuleID = new HashMap<String, List<String>>();
		invalidOccurrencesByRuleID = new HashMap<String, List<String>>();
		validRulesID = new ArrayList<String>();
		invalidRulesID = new ArrayList<String>();
	}

}