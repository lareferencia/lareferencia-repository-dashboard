package org.lareferencia.core.dashboard.security;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.keycloak.KeycloakSecurityContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class KeycloakSecurityService implements ISecurityService {

	@Value("${authz.admin-role}")
	private String adminRole;
	
	
	@Override
	public List<String> getRequestGroups(HttpServletRequest request) {
		
		KeycloakAuthorization authz = new KeycloakAuthorization( getKeycloakSecurityContext(request) );
		return authz.getGroups();
	
	}
	
	@Override
	public Boolean isAdminRequest(HttpServletRequest request) {
		KeycloakAuthorization authz = new KeycloakAuthorization( getKeycloakSecurityContext(request) );
		return authz.hasRole(adminRole);
	}
	
	////////////////////// private
	
	private KeycloakSecurityContext getKeycloakSecurityContext(HttpServletRequest request) {
		return (KeycloakSecurityContext) request.getAttribute(KeycloakSecurityContext.class.getName());
	}

}
