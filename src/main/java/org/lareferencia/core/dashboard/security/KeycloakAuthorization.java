package org.lareferencia.core.dashboard.security;

import java.util.List;
import java.util.Set;

import org.keycloak.AuthorizationContext;
import org.keycloak.KeycloakSecurityContext;
import org.keycloak.representations.idm.authorization.Permission;

public class KeycloakAuthorization {
	
	private final KeycloakSecurityContext securityContext;

    public KeycloakAuthorization (KeycloakSecurityContext securityContext) {
        this.securityContext = securityContext;
    }
    
    public boolean hasRole(String role) {
        return securityContext.getToken().getRealmAccess().isUserInRole(role);
    }
    
    public Set<String> getRoles(){
      return securityContext.getToken().getRealmAccess().getRoles();
    } 
    
    public List<String> getGroups(){
        return (List<String>) securityContext.getToken().getOtherClaims().get("groups");
    }    
    
    public boolean hasPermission(String name, String scope) {
        return getAuthorizationContext().hasPermission(name, scope);
    }
    
    public boolean hasResourcePermission(String name) {
        return hasPermission(name, null);
    }
    
    public List<Permission> getPermissions() {
        return getAuthorizationContext().getPermissions();
    }
    
    private AuthorizationContext getAuthorizationContext() {
        return securityContext.getAuthorizationContext();
    }

}
