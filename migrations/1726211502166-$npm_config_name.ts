import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1726211502166 implements MigrationInterface {
    name = ' $npmConfigName1726211502166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users_to_roles\` (\`role_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`role_id\`, \`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_2d443082eccd5198f95f2a36e2\` (\`login\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`students\` (\`id\` int NOT NULL AUTO_INCREMENT, \`record_book_number\` varchar(50) NOT NULL, \`name\` varchar(100) NULL, \`surname\` varchar(100) NULL, \`patronymic\` varchar(100) NULL, \`phone_number\` varchar(20) NULL, \`user_id\` int NULL, \`group_id\` int NULL, UNIQUE INDEX \`IDX_a82800bad7caac97718095ab00\` (\`record_book_number\`), UNIQUE INDEX \`REL_fb3eff90b11bddf7285f9b4e28\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`groups\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, \`faculty_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`faculties\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE INDEX \`IDX_e93c6d34c8fe01dded0844b0ad\` ON \`users_to_roles\` (\`user_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_e1ea0fe52eda3311425a3d253f\` ON \`users_to_roles\` (\`role_id\`)`);
        await queryRunner.query(`ALTER TABLE \`users_to_roles\` ADD CONSTRAINT \`FK_e1ea0fe52eda3311425a3d253f6\` FOREIGN KEY (\`role_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`users_to_roles\` ADD CONSTRAINT \`FK_e93c6d34c8fe01dded0844b0ada\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_fb3eff90b11bddf7285f9b4e281\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`students\` ADD CONSTRAINT \`FK_b9f6fcd8a397ee5b503191dd7c3\` FOREIGN KEY (\`group_id\`) REFERENCES \`groups\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`groups\` ADD CONSTRAINT \`FK_605decc6d0626239f9cf391fe2c\` FOREIGN KEY (\`faculty_id\`) REFERENCES \`faculties\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`groups\` DROP FOREIGN KEY \`FK_605decc6d0626239f9cf391fe2c\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_b9f6fcd8a397ee5b503191dd7c3\``);
        await queryRunner.query(`ALTER TABLE \`students\` DROP FOREIGN KEY \`FK_fb3eff90b11bddf7285f9b4e281\``);
        await queryRunner.query(`ALTER TABLE \`users_to_roles\` DROP FOREIGN KEY \`FK_e93c6d34c8fe01dded0844b0ada\``);
        await queryRunner.query(`ALTER TABLE \`users_to_roles\` DROP FOREIGN KEY \`FK_e1ea0fe52eda3311425a3d253f6\``);
        await queryRunner.query(`DROP INDEX \`IDX_e1ea0fe52eda3311425a3d253f\` ON \`users_to_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_e93c6d34c8fe01dded0844b0ad\` ON \`users_to_roles\``);
        await queryRunner.query(`DROP TABLE \`faculties\``);
        await queryRunner.query(`DROP TABLE \`groups\``);
        await queryRunner.query(`DROP INDEX \`REL_fb3eff90b11bddf7285f9b4e28\` ON \`students\``);
        await queryRunner.query(`DROP INDEX \`IDX_a82800bad7caac97718095ab00\` ON \`students\``);
        await queryRunner.query(`DROP TABLE \`students\``);
        await queryRunner.query(`DROP INDEX \`IDX_2d443082eccd5198f95f2a36e2\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_648e3f5447f725579d7d4ffdfb\` ON \`roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`users_to_roles\``);
    }

}
