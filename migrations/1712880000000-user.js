const { MigrationInterface, QueryRunner } = require('typeorm');

/**
 * @implements {MigrationInterface}
 */
module.exports = class User1712880000000 {
  name = 'User1712880000000';

  /** @param {QueryRunner} queryRunner */
  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TYPE "public"."user_sex_type_enum" AS ENUM('Unknown', 'Male', 'Female', 'Other')`,
    );
    await queryRunner.query(`
CREATE TABLE "user" (
  "id" BIGSERIAL NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  "email" character varying NOT NULL,
  "username" character varying NOT NULL,
  "password" character varying NOT NULL,
  "signature" character varying NOT NULL DEFAULT 'lorem-ipsum',
  "is_admin" boolean NOT NULL DEFAULT false,
  "name" character varying NOT NULL,
  "picture" character varying DEFAULT 'https://cdn.iconfinder.com/data/icons/music-ui-solid-24px/24/user_account_profile-2-256.png',
  "sex_type" "public"."user_sex_type_enum" DEFAULT 'Unknown',
  "birthdate" date,
  "telephone" character varying,
  CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
  CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
  CONSTRAINT "PK_cace4a159ff9f2512dd42473760" PRIMARY KEY ("id")
)`);
  }

  /** @param {QueryRunner} queryRunner */
  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_sex_type_enum"`);
  }
};
