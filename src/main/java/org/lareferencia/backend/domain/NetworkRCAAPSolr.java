package org.lareferencia.backend.domain;

import lombok.Getter;
import lombok.Setter;
import org.apache.solr.client.solrj.beans.Field;
import org.lareferencia.backend.network.RCAAPNetworkAttributes;
import org.springframework.data.annotation.Id;
import org.springframework.data.solr.core.mapping.Indexed;
import org.springframework.data.solr.core.mapping.SolrDocument;


@Getter
@Setter
@SolrDocument(solrCoreName = "networks")
public class NetworkRCAAPSolr {
	
	@Id
	@Field
	private Long id;
	
	@Indexed(type = "string", required = true)
	private String name;
	
	@Indexed(type = "string", name = "institution", required = true)
	private String institutionName;
	
	@Indexed(type = "string", required = false)
	private String isni;
	
	@Indexed(type = "string", required = false)
	private String ringold;
	
	@Indexed(type = "string", required = true)
	private String acronym;
	
	@Indexed(type = "string", required = false)
	private String type;
	
	@Indexed(type = "string", required = false)
	private String software;
	
	@Indexed(type = "string", required = false)
	private String email;
	
	@Indexed(type = "string", required = false)
	private String url;
	
	@Indexed(type = "strings", required = false)
	private String[] tags;
	
	@Indexed(type = "string", required = false, name = "description.pt")
	private String description_pt;
	
	@Indexed(type = "string", required = false, name = "description.en")
	private String description_en;
	
	@Indexed(type = "string", required = false)
	private String country;
	
	@Indexed(type = "string", required = false, name = "directory.url")
	private String directoryURL;
	
	@Indexed(type = "string", required = false, name = "oai.url")
	private String oaiURL;
	
	@Indexed(name = "roarmap", type = "string", required = false)
	private String roarMap;
	
	@Indexed(name = "opendoar", type = "string", required = false)
	private String openDoar;
	
	@Indexed(name = "sherpa", type = "string", required = false)
	private String sherpa;
	
	@Indexed(type = "string", required = false, name = "eissn")
	private String eissn;
	
	@Indexed(type = "string", required = false)
	private String pissn;
	
	@Indexed(type = "string", required = false)
	private String issnL;
	
	@Indexed(type = "string", required = false)
	private String handle;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean degois;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean cienciaVitae;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean cienciaId;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false, name = "openAIRE2")
	private Boolean openAIRE = false;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean openAIRE4 = false;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean driver = false;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean fct = false;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean thesis = false;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean fulltext = false;
	
	@Indexed(type = "boolean", defaultValue = "false", required = false)
	private Boolean accessibleContent = false;
	
	@Indexed(type = "string", required = false)
	private String handlePrefix;
	
	@Indexed(type = "string", required = false)
	private String doiPrefix;	
	
	
	public NetworkRCAAPSolr(Network other) {
		RCAAPNetworkAttributes attributes = (RCAAPNetworkAttributes) other.getAttributes();
		this.id = other.getId();
		this.name = other.getName();
		this.institutionName = other.getInstitutionName();
		this.isni = attributes.getIsni();
		this.ringold = attributes.getRingold();
		this.acronym = other.getAcronym();
		this.type = attributes.getType();
		this.software = attributes.getSoftware();
		this.email = attributes.getEmail();
		this.url = attributes.getUrl();
		this.tags = attributes.getTags();
		this.description_pt = attributes.getDescription_pt();
		this.description_en = attributes.getDescription_en();
		this.country = attributes.getCountry();
		this.directoryURL = attributes.getDirectoryURL();
		this.oaiURL = attributes.getOaiURL();
		this.roarMap = attributes.getRoarMap();
		this.openDoar = attributes.getOpenDoar();
		this.sherpa = attributes.getSherpa();
		this.eissn = attributes.getEissn();
		this.pissn = attributes.getPissn();
		this.issnL = attributes.getIssnL();
		this.handle = attributes.getHandle();
		this.degois = attributes.getDegois();
		this.cienciaVitae = attributes.getCienciaVitae();
		this.cienciaId = attributes.getCienciaId();
		this.openAIRE = attributes.getOpenAIRE();
		this.openAIRE4 = attributes.getOpenAIRE4();
		this.driver = attributes.getDriver();
		this.fct = attributes.getFct();
		this.thesis = attributes.getThesis();
		this.fulltext = attributes.getFulltext();
		this.accessibleContent = attributes.getAccessibleContent();
		this.handlePrefix = attributes.getHandlePrefix();
		this.doiPrefix = attributes.getDoiPrefix();
	}
}