import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const dbconfig: TypeOrmModuleOptions = {
	type: "mysql",
	host: process.env.MYSQL_DB_HOST || '127.0.0.1',
	port: Number.parseInt(process.env.MYSQL_DB_PORT || '3306', 10),
	username: process.env.MYSQL_DB_USERNAME || 'root',
	password: process.env.MYSQL_DB_PASSWORD || 'root',
	database: process.env.MYSQL_DB_NAME || 'database',
	synchronize: false,
  	entities: ["dist/**/*.entity{.ts,.js}"],
  	migrations: ["dist/migrations/*{.ts,.js}"],
  	migrationsTableName: "migration_table",
	logging: true,
};

export { dbconfig };

export const connectionSource = new DataSource({
	cli: {
		migrationsDir: 'migrations'
	},
	...dbconfig
} as DataSourceOptions);