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
  private String[] defaultRoles;
  private String[] userAttributes;
  private String[] groupAttributes;
  
  private final Keycloak keycloak;
  
  public KeycloakAdmin (String serverUrl, String realm, String tokenEndpoint, String clientId, String clientSecret, String[] defaultRoles, String[] userAttributes, String[] groupAttributes) {
  
    this.serverUrl = serverUrl;
	  this.realm = realm;
    this.tokenEndpoint = tokenEndpoint;
	  this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.defaultRoles = defaultRoles;
    this.userAttributes = userAttributes;
    this.groupAttributes = groupAttributes;
    
    keycloak = getKeycloakInstance();
  }
 
  public Response createUser (Map<String, String> userInfo){	
   
		UserRepresentation user = buildUserRepresentation(userInfo, false);
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
	
	public Response createGroup (Map<String, String> groupInfo){
		
    GroupRepresentation group = buildGroupRepresentation(groupInfo);
		
    return keycloak.realm(realm).groups().add(group);
	}
 
  public Map<String, String> getGroupInfo (String groupName){
		
		GroupRepresentation group = keycloak.realm(realm).getGroupByPath("/" + groupName);
		
		Map<String, String> groupInfo = new HashMap<String, String>();
		groupInfo.put("name", group.getName());
   
    for (String attribute : groupAttributes){
		  groupInfo.put(attribute, group.getAttributes().get(attribute).get(0));
		}
	
		return groupInfo;
	}
	
	public Boolean addUserToGroup (String userId, String groupName){
			
		GroupRepresentation group = new GroupRepresentation();
    
    if (groupExists(groupName)){
    	group = keycloak.realm(realm).getGroupByPath("/" + groupName);
		  keycloak.realm(realm).users().get(userId).joinGroup(group.getId());
		}
   
    return isUserInGroup(userId, group.getId());
	}
	
	public Map<String, String> getUserInfo (String userId){
		
		UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
		
		Map<String, String> userInfo = new HashMap<String, String>();
		userInfo.put("username", user.getUsername());
		userInfo.put("first_name", user.getFirstName());
		userInfo.put("last_name", user.getLastName());
		userInfo.put("email", user.getEmail());
   
    for (String attribute : userAttributes){
		  userInfo.put(attribute, user.getAttributes().get(attribute).get(0));
		}
	
		return userInfo;
	}
	
	public void updateUserInfo (String userId, Map<String, String> userInfo){
		
		UserRepresentation newInfo = buildUserRepresentation(userInfo, true);
		keycloak.realm(realm).users().get(userId).update(newInfo);
	}
	
	public void resetUserPassword (String userId, String password){
		
		CredentialRepresentation credential = buildUserCredential(password, true);
		keycloak.realm(realm).users().get(userId).resetPassword(credential);
	}
 
  private UserRepresentation buildUserRepresentation (Map<String, String> userInfo, boolean update){
	
		Map<String, List<String>> attributes = new HashMap<String, List<String>>();
   
    for (String attribute : userAttributes){
		  attributes.put(attribute, Arrays.asList(userInfo.get(attribute)));
		}
		
		UserRepresentation user = new UserRepresentation();
		user.setUsername(userInfo.get("username"));
		user.setFirstName(userInfo.get("first_name"));
		user.setLastName(userInfo.get("last_name"));
		user.setEmail(userInfo.get("email"));
		user.setAttributes(attributes);
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
 
  private GroupRepresentation buildGroupRepresentation (Map<String, String> groupInfo) {
		
		Map<String, List<String>> attributes = new HashMap<String, List<String>>();
		
    for (String attribute : groupAttributes){
		  attributes.put(attribute, Arrays.asList(groupInfo.get(attribute)));
		}
		
		GroupRepresentation group = new GroupRepresentation();
		group.setName(groupInfo.get("name"));
		group.setAttributes(attributes);
		
		return group;
	}
	
	private boolean groupExists (String groupName){
		
		boolean exists = true;
		
		try{
			keycloak.realm(realm).getGroupByPath("/" + groupName);
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