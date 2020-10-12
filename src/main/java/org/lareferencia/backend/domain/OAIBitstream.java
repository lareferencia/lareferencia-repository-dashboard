package org.lareferencia.backend.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.codec.digest.DigestUtils;
import org.hibernate.annotations.Type;
import org.lareferencia.backend.metadata.OAIMetadataBitstream;

import javax.persistence.*;
import java.util.Date;

/**
 * 
 */
@Getter
@Setter
@Entity
@JsonIgnoreProperties({})
public class OAIBitstream  {
	
	@EmbeddedId
	private OAIBitstreamId id;
	
	@Column(nullable = false)
	private String type;
	
	@Column(nullable = false)
	private String filename;
	
	@Column(nullable = false)
	private Integer sid;
	
	@Column(nullable = false)
	private String url;
	
	@Column(nullable = false)
	private String mime;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable = false)
	private Date datestamp;
	
	@Column(nullable = false)
	private OAIBitstreamStatus status;
	
	@Column
	@Type(type = "org.hibernate.type.TextType")
	private String fulltext;
	
	public OAIBitstream() {
		super();
		this.status = OAIBitstreamStatus.NEW;
		this.datestamp = new Date();
		
		
	}
	
	public OAIBitstream(Network network, String identifier, OAIMetadataBitstream mdbs) {
		this();
	
		if (  mdbs.getChecksum() == null || mdbs.getChecksum().isEmpty() ) {
			mdbs.setChecksum( (mdbs.getUrl())) ;
		}
		
		this.id = new OAIBitstreamId(network, identifier, mdbs.getChecksum());
		this.updateFromMetadata(mdbs);
	}
	
	public void updateFromMetadata(OAIMetadataBitstream mdbs) {
		
		this.filename = mdbs.getName();
		this.url = mdbs.getUrl();
		this.sid = mdbs.getSid();
		this.type = mdbs.getType();
		
		if ( !mdbs.getFormat().isEmpty() )
			this.mime = mdbs.getFormat();
		else 
			this.mime = "application/pdf";
		
	}
}
