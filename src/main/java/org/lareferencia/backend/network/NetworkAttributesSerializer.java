package org.lareferencia.backend.network;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class NetworkAttributesSerializer {

	// JsonObject Mapper
	private ObjectMapper mapper;

	public NetworkAttributesSerializer() {
		updateObjectMapper();
	}

	private void updateObjectMapper() {
		mapper = new ObjectMapper();
		mapper.registerSubtypes( AbstractNetworkAttributes.class );

	}

	
	public String serializeToJsonString(AbstractNetworkAttributes networkProperties) {

		try {
			return mapper.writeValueAsString(networkProperties);
		} catch (JsonProcessingException e) {
			// TODO Serialize rule exceptions
			e.printStackTrace();
		}
		return null;
	}
	
	public Map<String, Object> serializeToMap(AbstractNetworkAttributes networkProperties) {
		return  mapper.convertValue(networkProperties, Map.class);
	}

	public AbstractNetworkAttributes deserializeFromJsonString(String jsonString) {

		try {
			return mapper.readValue(jsonString, AbstractNetworkAttributes.class);
		} catch (JsonParseException e) {

			e.printStackTrace();
		} catch (JsonMappingException e) {

			e.printStackTrace();
		} catch (IOException e) {

			e.printStackTrace();
		}

		return null;
	}

	

}
