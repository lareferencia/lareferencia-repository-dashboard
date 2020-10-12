package org.lareferencia.backend.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.support.ResourcePropertySource;
import org.springframework.web.context.ConfigurableWebApplicationContext;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Properties;

public class AppContextInitializer implements ApplicationContextInitializer<ConfigurableWebApplicationContext> {
	
	private static Logger logger = LogManager.getLogger(AppContextInitializer.class);


	@Override
	public void initialize(ConfigurableWebApplicationContext applicationContext) {
		


		final String configFilePath = applicationContext.getServletContext().getInitParameter("mainConfigFilePath");
		
		class TrustAll implements X509TrustManager
		{
		    public void checkClientTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException
		    {
		    }

		    public void checkServerTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException
		    {
		    }

		    public X509Certificate[] getAcceptedIssuers()
		    {
		        return new X509Certificate[0];
		    }
		}


		try {

			// Se agregan las propiedades del archivo de configuración
			ResourcePropertySource source = new ResourcePropertySource("file:" + configFilePath);
			applicationContext.getEnvironment().getPropertySources().addFirst(source);

			// Se agrega una propieedad con el paht del archivo de conf para ser
			// accedido desde el xml de contextos
			Properties lrConfigProperties = new Properties();
			lrConfigProperties.put("backend.properties.path", configFilePath);

			PropertiesPropertySource pathsPSource = new PropertiesPropertySource("lrpaths", lrConfigProperties);
			applicationContext.getEnvironment().getPropertySources().addFirst(pathsPSource);
			
			SSLContext ctx = SSLContext.getInstance("TLS");
		    
		    ctx.init(null, new TrustManager[] { new TrustAll() }, null);
		    HttpsURLConnection.setDefaultSSLSocketFactory(ctx.getSocketFactory());

			logger.info("\n\n\n******************** Inicializando configuración desde  " + configFilePath + "  !!!\n\n\n");
			

		} catch (IOException e) {

			logger.error("\n\n\nNo se puede acceder al archivo de configuración principal:" + configFilePath +"\n\n\n");

			// handle error
		} catch (KeyManagementException | NoSuchAlgorithmException e) {
			logger.error("\n\n Problemas en la definicion de conexiones ssl enAppContextInitializer");

		} 
	}
}