package org.lareferencia.dashboard.app;

import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.repository.config.EnableSolrRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import io.swagger.annotations.Api;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@SpringBootApplication
@ComponentScan(  basePackages={ "org.lareferencia.core.dashboard", "org.lareferencia.app.dashboard" } )
@EntityScan( basePackages= { "org.lareferencia.backend.domain" } )
@EnableJpaRepositories( basePackages={ "org.lareferencia.backend.repositories.jpa" } )
@EnableSolrRepositories( basePackages= { "org.lareferencia.backend.repositories.solr" } ) 
@EnableAutoConfiguration( exclude = {
	    org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class
})
@EnableSwagger2
@Configuration
public class DashboardApplication {
	
	@Autowired
	private Environment enviroment;

	public static void main(String[] args) {
		SpringApplication.run(DashboardApplication.class, args);
	}
	
	/** Configurations beans for solr services */
	@Bean(name="solrClient")
    public SolrClient solrClient(@Value("${default.solr.server}") String solrHost) {
        return new HttpSolrClient.Builder(solrHost).build();
    }
	
	@Bean(name="validationSolrClient")
    public SolrClient validationSolrClient(@Value("${vstats.solr.server}") String solrHost) {
        return new HttpSolrClient.Builder(solrHost).build();
    }
	
	@Bean(name="solrTemplate")
    public SolrTemplate solrTemplate(@Qualifier("solrClient") SolrClient client) throws Exception {
        return new SolrTemplate(client);
    }	

    @Bean(name="validationSolrTemplate")
    public SolrTemplate validationSolrTemplate(@Qualifier("validationSolrClient") SolrClient solrClient) throws Exception {
        return new SolrTemplate(solrClient);
    }	
    
    @Bean(name="validationSolrCoreName")
    public String validationSolrCoreName(@Value("${vstats.solr.core}") String validationSolrCoreName) throws Exception {
        return validationSolrCoreName;
    }	
    
    @Bean
    public Docket api() {
        return new Docket(DocumentationType.SWAGGER_2)
                .groupName(enviroment.getProperty("rest.lareferencia.spec"))
                .select()
                .apis(RequestHandlerSelectors.withClassAnnotation(Api.class))
                //.paths(PathSelectors.any())
                .build().apiInfo(metadata());
    }

    private ApiInfo metadata() {
        return new ApiInfoBuilder()
                .title(enviroment.getProperty("rest.lareferencia.metadata.title"))
                .description(enviroment.getProperty("rest.lareferencia.metadata.description"))
                .version(enviroment.getProperty("rest.lareferencia.metadata.version"))
                .license(enviroment.getProperty("rest.lareferencia.metadata.license"))
                .licenseUrl(enviroment.getProperty("rest.lareferencia.metadata.licenseurl"))
                .build();
    }
    
    @SuppressWarnings("deprecation")
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
        	
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("http://localhost:4200");

            }           

        };          
    }    

}
