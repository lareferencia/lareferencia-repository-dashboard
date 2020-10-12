package org.lareferencia.backend.domain;

import java.io.Serializable;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class OAIBitstreamId implements Serializable {

	@ManyToOne
    @JoinColumn(name = "network_id")
    private Network network;
 
    @Column(name = "identifier")
    private String identifier;
    
    @Column(nullable = false)
	private String checksum;
	
    
    public OAIBitstreamId() {
    }
 
    public OAIBitstreamId(Network network, String identifier, String checksum) {
       this.identifier = identifier;
       this.network = network;
       this.checksum = checksum;
    }
 
 
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OAIBitstreamId)) return false;
        OAIBitstreamId that = (OAIBitstreamId) o;
        return Objects.equals(getIdentifier(), that.getIdentifier()) &&
                Objects.equals(getNetwork().getId(), that.getNetwork().getId()) && Objects.equals(getChecksum(), that.getChecksum());
    }
 
    @Override
    public int hashCode() {
        return Objects.hash(this.getChecksum(), this.getChecksum());
    }
}





 
    