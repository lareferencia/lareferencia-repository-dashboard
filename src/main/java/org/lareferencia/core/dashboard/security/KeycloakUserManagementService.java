package org.lareferencia.core.dashboard.security;

import java.util.List;
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
  
  @Value("${user-mgmt.user-role}")
  private String userRole;
	
  @Value("${user-mgmt.default-roles}")
  private String[] defaultRoles;
  
  @Value("${user-mgmt.user-attributes}")
  private String[] userAttributes;
  
  @Value("${user-mgmt.group-attributes}")
  private String[] groupAttributes;

  @Override
	public Boolean createUser(Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.createUser(infoMap, defaultRoles, userAttributes).getStatusInfo().toString().equals("Created");
	}

	@Override
	public Boolean deleteUser(String userId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.deleteUser(userId).getStatusInfo().toString().equals("No Content");
	}

	@Override
	public Boolean updateUser(String userId, Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    admin.updateUserInfo(userId, infoMap, userAttributes);
    return true;
	}

	@Override
	public Boolean changePassword(String userId, String passwd) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    admin.resetUserPassword(userId, passwd);
    return true;
	}

	@Override
	public Map<String, String> getUserInfo(String userId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.getUserInfo(userId, userAttributes);
	}

  @Override
  public List<String> getUserGroups(String userId) {
    
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.getUserGroups(userId);
  }
 
  @Override
  public List<String> listUsers() {
  
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.listUsers(userRole);
  }

	@Override
	public Boolean createGroup(Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
		return admin.createGroup(infoMap, groupAttributes).getStatusInfo().toString().equals("Created");
	}

	@Override
	public Boolean deleteGroup(String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    admin.deleteGroup(groupId);
    return true;
	}

	@Override
	public Boolean updateGroup(String groupId, Map<String, String> infoMap) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    admin.updateGroupInfo(groupId, infoMap, groupAttributes);
    return true;
	}

	@Override
	public Map<String, String> getGroupInfo(String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.getGroupInfo(groupId, groupAttributes);
	}

  @Override
  public List<String> getGroupMembers(String groupId) {
  
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.getGroupMembers(groupId);
  }
 
  @Override
  public List<String> listGroups() {
  
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
    return admin.listGroups();
  }

	@Override
	public Boolean addUserToGroup(String userId, String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
		return admin.addUserToGroup(userId, groupId);
	}
 
	@Override
	public Boolean removeUserFromGroup(String userId, String groupId) {
		
    KeycloakAdmin admin = new KeycloakAdmin(serverUrl, realm, tokenEndpoint, clientId, clientSecret);
		return admin.removeUserFromGroup(userId, groupId);
	}

}