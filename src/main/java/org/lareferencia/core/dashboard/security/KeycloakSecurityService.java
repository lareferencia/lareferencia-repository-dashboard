package org.lareferencia.core.dashboard.security;

import java.util.List;
import java.util.Map;

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

	@Override
	public Boolean createUser(String userId, Map<String, String> infoMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean deleteUser(String userId, Map<String, String> infoMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean updateUser(String userId, Map<String, String> infoMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean changePassword(String userId, String passwd) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, String> getUserInfo(String userId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean createGroup(String groupId, Map<String, String> infoMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean deleteGroup(String groupId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean updateGroup(String groupId, Map<String, String> infoMap) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Map<String, String> getGroupInfo(String groupId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean addUserToGroup(String userId, String groupId) {
		// TODO Auto-generated method stub
		return null;
	}

}
