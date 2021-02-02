package org.lareferencia.core.dashboard.security;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class KeycloakUserManagementService implements IUserManagementService {

  @Value("${keycloak.auth-server-url}")
  private String serverUrl;
 
  @Value("${keycloak.realm}") 
	private String realm;
 
  @Value("${user-mgmt.token-endpoint}")
	private String tokenEndpoint;
 
  @Value("${user-mgmt.client-id}")
	private String clientId;
	
  @Value("${user-mgmt.client-secret}")
  private String clientSecret;
	
  @Value("${user-mgmt.default-roles}")
  private String[] defaultRoles;
  
  @Value("${user-mgmt.user-attributes}")
  private String[] userAttributes;
  
  @Value("${user-mgmt.group-attributes}")
  private String[] groupAttributes;

  @Override
	public Boolean createUser(Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    return admin.createUser(infoMap).getStatusInfo().toString().equals("Created");
	}

	@Override
	public Boolean deleteUser(String userId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    return admin.deleteUser(userId).getStatusInfo().toString().equals("No Content");
	}

	@Override
	public Boolean updateUser(String userId, Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    admin.updateUserInfo(userId, infoMap);
    return true; //FIX
	}

	@Override
	public Boolean changePassword(String userId, String passwd) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    admin.resetUserPassword(userId, passwd);
    return true; //FIX
	}

	@Override
	public Map<String, String> getUserInfo(String userId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    return admin.getUserInfo(userId);
	}

	@Override
	public Boolean createGroup(Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
		return admin.createGroup(infoMap).getStatusInfo().toString().equals("Created");
	}

	@Override
	public Boolean deleteGroup(String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    admin.deleteGroup(groupId);
    return true; //FIX
	}

	@Override
	public Boolean updateGroup(String groupId, Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    admin.updateGroupInfo(groupId, infoMap);
    return true; //FIX
	}

	@Override
	public Map<String, String> getGroupInfo(String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
    return admin.getGroupInfo(groupId);
	}

	@Override
	public Boolean addUserToGroup(String userId, String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret, defaultRoles, userAttributes, groupAttributes);
		return admin.addUserToGroup(userId, groupId);
	}

}