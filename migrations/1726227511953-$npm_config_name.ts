import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1726227511953 implements MigrationInterface {
    name = ' $npmConfigName1726227511953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`results_to_indicators\` (\`indicator_id\` int NOT NULL, \`result_id\` int NOT NULL, \`score\` int NOT NULL, PRIMARY KEY (\`indicator_id\`, \`result_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`criteria_to_languages\` (\`language_id\` int NOT NULL, \`criterion_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`language_id\`, \`criterion_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`criteria\` (\`id\` int NOT NULL AUTO_INCREMENT, \`alarming\` tinyint NOT NULL, \`min_value\` int NOT NULL, \`max_value\` int NOT NULL, \`indicator_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`indicators\` (\`id\` int NOT NULL AUTO_INCREMENT, \`real_formula\` varchar(255) NOT NULL, \`validated_formula\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`display\` tinyint NOT NULL, \`method_id\` int NULL, UNIQUE KEY \`unique_name_method\` (\`method_id\`, \`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`indicators_to_languages\` (\`language_id\` int NOT NULL, \`indicator_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_9c0e155475f0aa782e4a612000\` (\`name\`), PRIMARY KEY (\`language_id\`, \`indicator_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answers_to_languages\` (\`language_id\` int NOT NULL, \`answer_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`language_id\`, \`answer_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`point\` int NOT NULL, \`question_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`index\` int NOT NULL, \`method_id\` int NULL, UNIQUE KEY \`unique_index_method\` (\`method_id\`, \`index\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questions_to_languages\` (\`language_id\` int NOT NULL, \`question_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`language_id\`, \`question_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`languages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_9c0e155475f0aa782e4a617896\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`methods_to_languages\` (\`language_id\` int NOT NULL, \`method_id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`language_id\`, \`method_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`methods\` (\`id\` int NOT NULL AUTO_INCREMENT, \`timer\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`available_methods\` (\`method_id\` int NOT NULL, \`student_id\` int NOT NULL, \`date_end\` timestamp NOT NULL, \`display_result\` tinyint NOT NULL, \`is_overdue\` tinyint NOT NULL, \`is_anonymous\` tinyint NOT NULL, PRIMARY KEY (\`method_id\`, \`student_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`results\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` timestamp NOT NULL, \`display\` tinyint NOT NULL, \`student_id\` int NULL, \`method_id\` int NULL, \`is_anonymous\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`results_to_answers\` (\`answer_id\` int NOT NULL, \`result_id\` int NOT NULL, PRIMARY KEY (\`answer_id\`, \`result_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`user_id\` int NOT NULL, \`refreshToken\` varchar(255) NOT NULL, PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE INDEX \`IDX_dfa55d1b5d243fcab6efffd3cc\` ON \`results_to_answers\` (\`result_id\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_dbd6eb05a051ec990b7d6d07a5\` ON \`results_to_answers\` (\`answer_id\`)`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_refresh_tokens\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`results_to_indicators\` ADD CONSTRAINT \`FK_0c7a98ea6a87de5220fc53c152d\` FOREIGN KEY (\`indicator_id\`) REFERENCES \`indicators\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`results_to_indicators\` ADD CONSTRAINT \`FK_4e573e60a9e38f546a3bac832b2\` FOREIGN KEY (\`result_id\`) REFERENCES \`results\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`criteria_to_languages\` ADD CONSTRAINT \`FK_6775d1b802c5950e6e6f0a874ba\` FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`criteria_to_languages\` ADD CONSTRAINT \`FK_afc312deef16b5c3765bbb98d57\` FOREIGN KEY (\`criterion_id\`) REFERENCES \`criteria\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`criteria\` ADD CONSTRAINT \`FK_15f2f77972240997734152c7b10\` FOREIGN KEY (\`indicator_id\`) REFERENCES \`indicators\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`indicators\` ADD CONSTRAINT \`FK_d95cdf165cd23f8b1356f1fddc1\` FOREIGN KEY (\`method_id\`) REFERENCES \`methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`indicators_to_languages\` ADD CONSTRAINT \`FK_b067fc1c4fbbacfdc3218c61a86\` FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`indicators_to_languages\` ADD CONSTRAINT \`FK_ecf25a6c9b410252efcd28b045d\` FOREIGN KEY (\`indicator_id\`) REFERENCES \`indicators\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`answers_to_languages\` ADD CONSTRAINT \`FK_57a0a6dd5c7ab2528539c7f5c6f\` FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`answers_to_languages\` ADD CONSTRAINT \`FK_c92b2831f2d00ba502424b405a4\` FOREIGN KEY (\`answer_id\`) REFERENCES \`answers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`answers\` ADD CONSTRAINT \`FK_677120094cf6d3f12df0b9dc5d3\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`questions\` ADD CONSTRAINT \`FK_0cad0f5164df88894c7f4242327\` FOREIGN KEY (\`method_id\`) REFERENCES \`methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`questions_to_languages\` ADD CONSTRAINT \`FK_67b293c8ab0818cd4664de7b8d8\` FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`questions_to_languages\` ADD CONSTRAINT \`FK_7c9b59d2976bef943323754534b\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`methods_to_languages\` ADD CONSTRAINT \`FK_6d195c889add38c01c6d60cce8b\` FOREIGN KEY (\`language_id\`) REFERENCES \`languages\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`methods_to_languages\` ADD CONSTRAINT \`FK_906cb6d788f6d9c8ac0ba778d43\` FOREIGN KEY (\`method_id\`) REFERENCES \`methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`available_methods\` ADD CONSTRAINT \`FK_5800ce9eb9ce7478ef43a7d3a12\` FOREIGN KEY (\`method_id\`) REFERENCES \`methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`available_methods\` ADD CONSTRAINT \`FK_1ba205aa78fc3f14b0e7c54753a\` FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`results\` ADD CONSTRAINT \`FK_7c5bf104ec5fbc6d177be01af8e\` FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`results\` ADD CONSTRAINT \`FK_8422fe7cdb3dea6f28b91785dc5\` FOREIGN KEY (\`method_id\`) REFERENCES \`methods\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`results_to_answers\` ADD CONSTRAINT \`FK_dbd6eb05a051ec990b7d6d07a51\` FOREIGN KEY (\`answer_id\`) REFERENCES \`answers\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE \`results_to_answers\` ADD CONSTRAINT \`FK_dfa55d1b5d243fcab6efffd3ccb\` FOREIGN KEY (\`result_id\`) REFERENCES \`results\`(\`id\`) ON DELETE RESTRICT ON UPDATE RESTRICT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`results_to_answers\` DROP FOREIGN KEY \`FK_dfa55d1b5d243fcab6efffd3ccb\``);
        await queryRunner.query(`ALTER TABLE \`results_to_answers\` DROP FOREIGN KEY \`FK_dbd6eb05a051ec990b7d6d07a51\``);
        await queryRunner.query(`ALTER TABLE \`results\` DROP FOREIGN KEY \`FK_8422fe7cdb3dea6f28b91785dc5\``);
        await queryRunner.query(`ALTER TABLE \`results\` DROP FOREIGN KEY \`FK_7c5bf104ec5fbc6d177be01af8e\``);
        await queryRunner.query(`ALTER TABLE \`available_methods\` DROP FOREIGN KEY \`FK_1ba205aa78fc3f14b0e7c54753a\``);
        await queryRunner.query(`ALTER TABLE \`available_methods\` DROP FOREIGN KEY \`FK_5800ce9eb9ce7478ef43a7d3a12\``);
        await queryRunner.query(`ALTER TABLE \`methods_to_languages\` DROP FOREIGN KEY \`FK_906cb6d788f6d9c8ac0ba778d43\``);
        await queryRunner.query(`ALTER TABLE \`methods_to_languages\` DROP FOREIGN KEY \`FK_6d195c889add38c01c6d60cce8b\``);
        await queryRunner.query(`ALTER TABLE \`questions_to_languages\` DROP FOREIGN KEY \`FK_7c9b59d2976bef943323754534b\``);
        await queryRunner.query(`ALTER TABLE \`questions_to_languages\` DROP FOREIGN KEY \`FK_67b293c8ab0818cd4664de7b8d8\``);
        await queryRunner.query(`ALTER TABLE \`questions\` DROP FOREIGN KEY \`FK_0cad0f5164df88894c7f4242327\``);
        await queryRunner.query(`ALTER TABLE \`answers\` DROP FOREIGN KEY \`FK_677120094cf6d3f12df0b9dc5d3\``);
        await queryRunner.query(`ALTER TABLE \`answers_to_languages\` DROP FOREIGN KEY \`FK_c92b2831f2d00ba502424b405a4\``);
        await queryRunner.query(`ALTER TABLE \`answers_to_languages\` DROP FOREIGN KEY \`FK_57a0a6dd5c7ab2528539c7f5c6f\``);
        await queryRunner.query(`ALTER TABLE \`indicators_to_languages\` DROP FOREIGN KEY \`FK_ecf25a6c9b410252efcd28b045d\``);
        await queryRunner.query(`ALTER TABLE \`indicators_to_languages\` DROP FOREIGN KEY \`FK_b067fc1c4fbbacfdc3218c61a86\``);
        await queryRunner.query(`ALTER TABLE \`indicators\` DROP FOREIGN KEY \`FK_d95cdf165cd23f8b1356f1fddc1\``);
        await queryRunner.query(`ALTER TABLE \`criteria\` DROP FOREIGN KEY \`FK_15f2f77972240997734152c7b10\``);
        await queryRunner.query(`ALTER TABLE \`criteria_to_languages\` DROP FOREIGN KEY \`FK_afc312deef16b5c3765bbb98d57\``);
        await queryRunner.query(`ALTER TABLE \`criteria_to_languages\` DROP FOREIGN KEY \`FK_6775d1b802c5950e6e6f0a874ba\``);
        await queryRunner.query(`ALTER TABLE \`results_to_indicators\` DROP FOREIGN KEY \`FK_4e573e60a9e38f546a3bac832b2\``);
        await queryRunner.query(`ALTER TABLE \`results_to_indicators\` DROP FOREIGN KEY \`FK_0c7a98ea6a87de5220fc53c152d\``);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_refresh_tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_dbd6eb05a051ec990b7d6d07a5\` ON \`results_to_answers\``);
        await queryRunner.query(`DROP INDEX \`IDX_dfa55d1b5d243fcab6efffd3cc\` ON \`results_to_answers\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
        await queryRunner.query(`DROP TABLE \`results_to_answers\``);
        await queryRunner.query(`DROP TABLE \`results\``);
        await queryRunner.query(`DROP TABLE \`available_methods\``);
        await queryRunner.query(`DROP TABLE \`methods\``);
        await queryRunner.query(`DROP TABLE \`methods_to_languages\``);
        await queryRunner.query(`DROP INDEX \`IDX_9c0e155475f0aa782e4a617896\` ON \`languages\``);
        await queryRunner.query(`DROP TABLE \`languages\``);
        await queryRunner.query(`DROP TABLE \`questions_to_languages\``);
        await queryRunner.query(`DROP TABLE \`questions\``);
        await queryRunner.query(`DROP TABLE \`answers\``);
        await queryRunner.query(`DROP TABLE \`answers_to_languages\``);
        await queryRunner.query(`DROP TABLE \`indicators_to_languages\``);
        await queryRunner.query(`DROP TABLE \`indicators\``);
        await queryRunner.query(`DROP TABLE \`criteria\``);
        await queryRunner.query(`DROP TABLE \`criteria_to_languages\``);
        await queryRunner.query(`DROP TABLE \`results_to_indicators\``);
        
    }

}
