package org.lareferencia.core.dashboard.security;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class KeycloakAdmin {

  private String serverUrl;
	private String realm;
	private String tokenEndpoint;
	private String clientId;
  private String clientSecret;
  
  private final Keycloak keycloak;
  
  public KeycloakAdmin (String serverUrl, String realm, String tokenEndpoint, String clientId, String clientSecret) {
  
    this.serverUrl = serverUrl;
	  this.realm = realm;
    this.tokenEndpoint = tokenEndpoint;
	  this.clientId = clientId;
    this.clientSecret = clientSecret;
    
    keycloak = getKeycloakInstance();
  }
 
  public Response createUser (Map<String, String> userInfo, String[] defaultRoles, String[] userAttributes){	
   
		UserRepresentation user = buildUserRepresentation(userInfo, userAttributes, false);
		Response response = keycloak.realm(realm).users().create(user);
   
		//Add default roles to user
		List<RoleRepresentation> roles = new ArrayList<RoleRepresentation>();
				
		for (String role : defaultRoles){
			roles.add(keycloak.realm(realm).roles().get(role).toRepresentation());	
		}
		
		String responsePath = response.getLocation().toString();
		String userId = responsePath.substring(responsePath.lastIndexOf('/') + 1);
		keycloak.realm(realm).users().get(userId).roles().realmLevel().add(roles);
   
   return response;
	}
	
	public Map<String, String> getUserInfo (String username, String[] userAttributes){
		
    UserRepresentation user = keycloak.realm(realm).users().get(getUserId(username)).toRepresentation();
    Map<String, List<String>> attributes = user.getAttributes();
		List<String> defaultValue = Arrays.asList("");

		Map<String, String> userInfo = new HashMap<String, String>();
		userInfo.put("username", user.getUsername());
		userInfo.put("first_name", user.getFirstName());
		userInfo.put("last_name", user.getLastName());
		userInfo.put("email", user.getEmail());		
		
		for (String attribute : userAttributes){
			userInfo.put(attribute, Objects.isNull(attributes) ? "" : attributes.getOrDefault(attribute, defaultValue).get(0));
		}
	
		return userInfo;
	}
	
	public void updateUserInfo (String username, Map<String, String> userInfo, String[] userAttributes){
		
		UserRepresentation newInfo = buildUserRepresentation(userInfo, userAttributes, true);
		keycloak.realm(realm).users().get(getUserId(username)).update(newInfo);
	}
	
	public void resetUserPassword (String username, String password){
		
		CredentialRepresentation credential = buildUserCredential(password, true);
		keycloak.realm(realm).users().get(getUserId(username)).resetPassword(credential);
	}
	
	public Response deleteUser (String username){
  
    return keycloak.realm(realm).users().delete(getUserId(username));
  }
  
  public List<String> listUsers (String role){
		
		List<String> usernames = new ArrayList<String>();		
		Set<UserRepresentation> users = keycloak.realm(realm).roles().get(role).getRoleUserMembers();
		users.forEach(user -> usernames.add(user.getUsername()));
		
		return usernames;
	}
	
	public Response createGroup (Map<String, String> groupInfo, String[] groupAttributes){
		
    GroupRepresentation group = buildGroupRepresentation(groupInfo, groupAttributes);
		
    return keycloak.realm(realm).groups().add(group);
	}
 
  public Map<String, String> getGroupInfo (String groupname, String[] groupAttributes){
		
		GroupRepresentation group = keycloak.realm(realm).getGroupByPath("/" + groupname);
    Map<String, List<String>> attributes = group.getAttributes();
		List<String> defaultValue = Arrays.asList("");
		
		Map<String, String> groupInfo = new HashMap<String, String>();
		groupInfo.put("name", group.getName());
   
    for (String attribute : groupAttributes){
      groupInfo.put(attribute, Objects.isNull(attributes) ? "" : attributes.getOrDefault(attribute, defaultValue).get(0));
		}
	
		return groupInfo;
	}
	
	 public void updateGroupInfo (String groupname, Map<String, String> groupInfo, String[] groupAttributes){
		
		GroupRepresentation group = keycloak.realm(realm).getGroupByPath("/" + groupname);
    GroupRepresentation newInfo = buildGroupRepresentation(groupInfo, groupAttributes);
		keycloak.realm(realm).groups().group(group.getId()).update(newInfo);
	}
  
  public void deleteGroup (String groupname){
    
    if (groupExists(groupname)){
    	GroupRepresentation group = keycloak.realm(realm).getGroupByPath("/" + groupname);
		  keycloak.realm(realm).groups().group(group.getId()).remove();
		}
  }
  
  public List<String> listGroups (){
		
		List<String> groupnames = new ArrayList<String>();		
		List<GroupRepresentation> groups = keycloak.realm(realm).groups().groups();
		groups.forEach(group -> groupnames.add(group.getName()));
		
		return groupnames;
	}
	
	public Boolean addUserToGroup (String username, String groupname){
			
		GroupRepresentation group = new GroupRepresentation();
    
    if (groupExists(groupname)){
    	group = keycloak.realm(realm).getGroupByPath("/" + groupname);
		  keycloak.realm(realm).users().get(getUserId(username)).joinGroup(group.getId());
		}
   
    return isUserInGroup(getUserId(username), group.getId());
	}
 
  public Boolean removeUserFromGroup (String username, String groupname){
			
		GroupRepresentation group = new GroupRepresentation();
    
    if (groupExists(groupname)){
    	group = keycloak.realm(realm).getGroupByPath("/" + groupname);
		  keycloak.realm(realm).users().get(getUserId(username)).leaveGroup(group.getId());
		}
   
    return !isUserInGroup(getUserId(username), group.getId());
	}
 
  private String getUserId (String username) {
		
		List<UserRepresentation> users = keycloak.realm(realm).users().search(username); // substring-based match, can return more than one user
		
		for (UserRepresentation user : users) {
			if (user.getUsername().equals(username)) return user.getId();
		}
		
		return null;
	}

  private UserRepresentation buildUserRepresentation (Map<String, String> userInfo, String[] userAttributes, boolean update){
		
		UserRepresentation user = new UserRepresentation();
		user.setUsername(userInfo.get("username"));
		user.setFirstName(userInfo.get("first_name"));
		user.setLastName(userInfo.get("last_name"));
		user.setEmail(userInfo.get("email"));
		
    for (String attribute : userAttributes){
		  user.singleAttribute(attribute, userInfo.getOrDefault(attribute, ""));
		}
   
		user.setEnabled(true);
		
		//Add credentials only if it is a new user
		if (!update){
			CredentialRepresentation credential = buildUserCredential(userInfo.get("password"), false);
			List<CredentialRepresentation> credentials = Arrays.asList(credential);	
			
			user.setCredentials(credentials);
		}
		
		return user;
	}
	
	private CredentialRepresentation buildUserCredential (String password, boolean reset){
		
		CredentialRepresentation credential = new CredentialRepresentation();
		credential.setType(CredentialRepresentation.PASSWORD);
		credential.setValue(password);
		credential.setTemporary(!reset); //password is temporary only if being set for the first time
		
		return credential;
	}
 
  private GroupRepresentation buildGroupRepresentation (Map<String, String> groupInfo, String[] groupAttributes) {
		
		GroupRepresentation group = new GroupRepresentation();
		group.setName(groupInfo.get("name"));
		
    for (String attribute : groupAttributes){
      group.singleAttribute(attribute, groupInfo.getOrDefault(attribute, ""));
		}
		
		return group;
	}
	
	private boolean groupExists (String groupname){
		
		boolean exists = true;
		
		try{
			keycloak.realm(realm).getGroupByPath("/" + groupname);
		}
		catch (NotFoundException e){
			exists = false;
		}
		
		return exists;
	}
 
  private boolean isUserInGroup (String userId, String groupId) {
		
		List<GroupRepresentation> userGroups = keycloak.realm(realm).users().get(userId).groups();
		
		for (GroupRepresentation userGroup : userGroups) {
			if (userGroup.getId().equals(groupId)) return true;
		}
		
		return false;
	}
 
  private Keycloak getKeycloakInstance (){
    
    String token = getAuthToken(clientId, clientSecret);
		
		return Keycloak.getInstance(serverUrl, realm, clientId, token);
	}
  
  private String getAuthToken (String id, String secret) {
		
		String token = new String();
		
		try {			
			//Set parameters
			Map<String, String> params = new HashMap<String, String>();
	    params.put("grant_type", "client_credentials");
	    params.put("client_id", id);
	    params.put("client_secret", secret);

	    StringBuilder postData = new StringBuilder();
	        
	    for (Map.Entry<String, String> param : params.entrySet()) {
        if (postData.length() != 0){
	        postData.append('&');
        }
        postData.append(URLEncoder.encode(param.getKey(), StandardCharsets.UTF_8.toString()));
	      postData.append('=');
	      postData.append(URLEncoder.encode(param.getValue(), StandardCharsets.UTF_8.toString()));
      }
	        
	    byte[] postDataBytes = postData.toString().getBytes(StandardCharsets.UTF_8);
			
	    //Call token endpoint
	    URL url = new URL(serverUrl + tokenEndpoint);
	    HttpURLConnection con = (HttpURLConnection) url.openConnection();
			
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); 
			con.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
	    con.setDoOutput(true);
	    con.getOutputStream().write(postDataBytes);
			
	    //Read the response
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));
			StringBuffer content = new StringBuffer();
			String inputLine;
			
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}
			
			in.close();
			con.disconnect();
			
			//Get the token
      ObjectMapper mapper = new ObjectMapper();
      Map<String, String> response = mapper.readValue(content.toString(), new TypeReference<Map<String, String>>() {});
      token = response.get("access_token");
          	
		} catch (MalformedURLException e) {
			  e.printStackTrace();
		} catch (IOException e) {
			  e.printStackTrace();
		}
		
		return token;
	}

}