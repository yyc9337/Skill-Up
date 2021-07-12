package com.surfinn.glzza.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.io.IOException;

@Slf4j
@Configuration
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
@EnableTransactionManagement
@MapperScan(basePackages =  "com.surfinn.glzza.mybatis.mapper", sqlSessionFactoryRef = "hikariSqlSessionFactory")
public class DataSourceConfig {
	
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
	public HikariConfig hikariConfig() {		
		return new HikariConfig();
	}
	
	@Bean(name = "hikariDataSource")
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
    public DataSource hikariDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }
	

	@Bean(name = "hikariSqlSessionFactory")
    public SqlSessionFactory hikariSqlSessionFactory(@Qualifier("hikariDataSource") DataSource hikariDataSource, ApplicationContext applicationContext) throws IOException {
        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(hikariDataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage("com.surfinn.glzza.vo");
        sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:com/surfinn/glzza/mybatis/mapper/*Mapper.xml"));
        sqlSessionFactoryBean.setConfiguration(mybatisConfig());
        try {
			return sqlSessionFactoryBean.getObject();
		} catch (Exception e) {
			log.error(e.toString(), e);
			return null;
		}
    }
	
	@Primary
    @Bean
    public org.apache.ibatis.session.Configuration mybatisConfig()
    {
    	org.apache.ibatis.session.Configuration config = new org.apache.ibatis.session.Configuration();
    	config.setMapUnderscoreToCamelCase(true);
        return config;
    }
	
	
	@Primary
    @Bean(name = "hikariSessionTemplate")
    public SqlSessionTemplate hikariSessionTemplate(@Qualifier("hikariSqlSessionFactory") SqlSessionFactory hikariSqlSessionFactory) {
        return new SqlSessionTemplate(hikariSqlSessionFactory);
    }
	
	@Primary	
	@Bean(name = "hikariTransmanager")
	public DataSourceTransactionManager transactionManager(@Qualifier("hikariDataSource") DataSource hikariDataSource) {
		return new DataSourceTransactionManager(hikariDataSource);
	}
}